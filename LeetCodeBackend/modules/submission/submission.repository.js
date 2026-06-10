const prisma = require('../../lib/prisma');
const SolutionCode = require('../../models/SolutionCode');
const ExecutionLog = require('../../models/ExecutionLog');

// ─── PostgreSQL ──────────────────────────────────────────────────────────────

const createSubmission = (data) =>
    prisma.submission.create({ data });

const updateSubmission = (id, data) =>
    prisma.submission.update({ where: { id }, data });

const findById = (id) =>
    prisma.submission.findUnique({
        where: { id },
        include: {
            problem: { select: { id: true, title: true, difficulty: true } },
            user: { select: { id: true, username: true } }
        }
    });

const listByUser = ({ userId, problemId, status, skip, take }) => {
    const where = { userId };
    if (problemId) where.problemId = problemId;
    if (status) where.status = status;

    return prisma.submission.findMany({
        where,
        skip,
        take,
        orderBy: { submittedAt: 'desc' },
        include: {
            problem: { select: { id: true, title: true, difficulty: true } }
        }
    });
};

const countByUser = ({ userId, problemId, status }) => {
    const where = { userId };
    if (problemId) where.problemId = problemId;
    if (status) where.status = status;
    return prisma.submission.count({ where });
};

// Check if user already has an accepted submission for this problem
const hasAccepted = (userId, problemId) =>
    prisma.submission.findFirst({ where: { userId, problemId, status: 'ACCEPTED' } });

// ─── Coin transactions ───────────────────────────────────────────────────────

const createCoinTransaction = (data) =>
    prisma.coinTransaction.create({ data });

// ─── Streak ──────────────────────────────────────────────────────────────────

const getStreak = (userId) =>
    prisma.userStreak.findUnique({ where: { userId } });

const updateStreak = (userId, data) =>
    prisma.userStreak.update({ where: { userId }, data });

// ─── Problem of day stats ────────────────────────────────────────────────────

const updatePodStats = async (problemId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pod = await prisma.problemOfDay.findUnique({ where: { date: today } });
    if (!pod || pod.problemId !== problemId) return;

    const [total, accepted] = await Promise.all([
        prisma.submission.count({ where: { problemId } }),
        prisma.submission.count({ where: { problemId, status: 'ACCEPTED' } })
    ]);

    await prisma.problemOfDay.update({
        where: { date: today },
        data: {
            solvedByCount: { increment: 1 },
            acceptanceRate: total ? parseFloat((accepted / total * 100).toFixed(2)) : 0
        }
    });
};

// ─── MongoDB ─────────────────────────────────────────────────────────────────

const saveSolutionCode = (data) =>
    SolutionCode.create(data);

const getSolutionCode = (submissionId) =>
    SolutionCode.findOne({ submissionId });

const saveExecutionLog = (data) =>
    ExecutionLog.create(data);

const getExecutionLog = (submissionId) =>
    ExecutionLog.findOne({ submissionId });

module.exports = {
    createSubmission, updateSubmission, findById, listByUser, countByUser, hasAccepted,
    createCoinTransaction, getStreak, updateStreak, updatePodStats,
    saveSolutionCode, getSolutionCode, saveExecutionLog, getExecutionLog
};
