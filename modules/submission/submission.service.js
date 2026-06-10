const repo = require('./submission.repository');
const ProblemTestCase = require('../../models/ProblemTestCase');
const prisma = require('../../lib/prisma');
const createError = require('../../utils/createError');

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'c', 'typescript', 'go', 'rust'];

// Mock code executor — replace with Judge0 / real sandbox in production
const mockExecute = (testCases) => {
    const runtime = parseFloat((Math.random() * 150 + 10).toFixed(2));
    const memory = parseFloat((Math.random() * 40 + 10).toFixed(2));
    return {
        status: 'ACCEPTED',
        testCasesPassed: testCases.length,
        testCasesFailed: 0,
        runtime,
        memory
    };
};

const updateStreak = async (userId) => {
    const streak = await repo.getStreak(userId);
    if (!streak) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().slice(0, 10);

    const grid = typeof streak.streakGrid === 'object' ? streak.streakGrid : {};

    // Already marked active today
    if (grid[todayKey]) return;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);

    const newStreak = grid[yKey] ? streak.currentStreak + 1 : 1;
    const longest = Math.max(streak.longestStreak, newStreak);

    grid[todayKey] = 1;

    await repo.updateStreak(userId, {
        currentStreak: newStreak,
        longestStreak: longest,
        lastActiveDate: today,
        streakGrid: grid,
        year: today.getFullYear()
    });
};

const submit = async (userId, { problemId, language, code, contestId }) => {
    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
        throw createError(`Unsupported language: ${language}`, 400);
    }

    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) throw createError('Problem not found', 404);

    // Create pending submission
    const submission = await repo.createSubmission({
        userId, problemId, language: language.toLowerCase(),
        status: 'PENDING',
        contestId: contestId || null
    });

    // Save source code to MongoDB
    await repo.saveSolutionCode({
        submissionId: submission.id,
        language: language.toLowerCase(),
        sourceCode: code
    });

    // Fetch all test cases and execute (mock)
    const testCases = await ProblemTestCase.find({ problemId });
    const result = mockExecute(testCases);

    // Update submission in SQL
    const updated = await repo.updateSubmission(submission.id, {
        status: result.status,
        runtime: result.runtime,
        memory: result.memory
    });

    // Save execution log to MongoDB
    await repo.saveExecutionLog({
        submissionId: submission.id,
        status: result.status,
        testCasesPassed: result.testCasesPassed,
        testCasesFailed: result.testCasesFailed,
        runtime: result.runtime,
        memory: result.memory
    });

    // On first accepted: award coins + update streak
    if (result.status === 'ACCEPTED') {
        const alreadySolved = await repo.hasAccepted(userId, problemId);
        // Only award if this is the FIRST accepted (alreadySolved would be this submission)
        const priorAccepted = await prisma.submission.findFirst({
            where: { userId, problemId, status: 'ACCEPTED', id: { not: submission.id } }
        });

        if (!priorAccepted && problem.coinsOnSolve > 0) {
            await repo.createCoinTransaction({
                userId,
                referenceId: submission.id,
                referenceKey: 'submission',
                amount: problem.coinsOnSolve,
                transactionType: 'EARNED'
            });
        }

        await updateStreak(userId);
        await repo.updatePodStats(problemId);
    }

    return updated;
};

const runCode = async (userId, { problemId, language, code }) => {
    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
        throw createError(`Unsupported language: ${language}`, 400);
    }
    if (!await prisma.problem.findUnique({ where: { id: problemId } })) {
        throw createError('Problem not found', 404);
    }

    const sampleCases = await ProblemTestCase.find({ problemId, type: 'sample' }).limit(5);
    const result = mockExecute(sampleCases);

    return {
        status: result.status,
        runtime: result.runtime,
        memory: result.memory,
        testCasesPassed: result.testCasesPassed,
        testCasesTotal: sampleCases.length,
        note: 'Run against sample test cases only. Submit to run all test cases.'
    };
};

const getSubmission = async (userId, submissionId) => {
    const submission = await repo.findById(submissionId);
    if (!submission) throw createError('Submission not found', 404);
    if (submission.userId !== userId) throw createError('Forbidden', 403);

    const [code, log] = await Promise.all([
        repo.getSolutionCode(submissionId),
        repo.getExecutionLog(submissionId)
    ]);

    return { ...submission, code, executionLog: log };
};

const listSubmissions = async (userId, { problemId, status, page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * take;

    const [submissions, total] = await Promise.all([
        repo.listByUser({ userId, problemId, status, skip, take }),
        repo.countByUser({ userId, problemId, status })
    ]);

    return {
        submissions,
        pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) }
    };
};

module.exports = { submit, runCode, getSubmission, listSubmissions };
