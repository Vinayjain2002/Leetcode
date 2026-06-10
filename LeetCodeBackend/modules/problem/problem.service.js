const repo = require('./problem.repository');
const createError = require('../../utils/createError');

const listProblems = async ({ difficulty, tags, search, page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 100);
    const skip = (Number(page) - 1) * take;
    const tagIds = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

    const [problems, total] = await Promise.all([
        repo.listProblems({ difficulty, tagIds, search, skip, take }),
        repo.countProblems({ difficulty, tagIds, search })
    ]);

    return {
        problems,
        pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) }
    };
};

const getProblem = async (id) => {
    const [problem, description] = await Promise.all([
        repo.findById(id),
        repo.getDescription(id)
    ]);
    if (!problem) throw createError('Problem not found', 404);

    const acceptanceRate = await repo.getAcceptanceRate(id);
    return { ...problem, description, acceptanceRate };
};

const createProblem = async (userId, body) => {
    const { title, difficulty, coinsOnSolve, description, tags } = body;

    const problem = await repo.createProblem({
        title, difficulty, coinsOnSolve: coinsOnSolve || 0, createdByUserId: userId
    });

    if (description) {
        await repo.upsertDescription(problem.id, description);
    }

    if (tags && tags.length) {
        await Promise.all(tags.map((tagId) => repo.addTag(problem.id, tagId)));
    }

    return repo.findById(problem.id);
};

const updateProblem = async (id, body) => {
    const problem = await repo.findById(id);
    if (!problem) throw createError('Problem not found', 404);

    const { title, difficulty, coinsOnSolve, description } = body;
    const sqlData = {};
    if (title !== undefined) sqlData.title = title;
    if (difficulty !== undefined) sqlData.difficulty = difficulty;
    if (coinsOnSolve !== undefined) sqlData.coinsOnSolve = coinsOnSolve;

    if (Object.keys(sqlData).length) {
        await repo.updateProblem(id, sqlData);
    }
    if (description) {
        await repo.upsertDescription(id, description);
    }

    return repo.findById(id);
};

const deleteProblem = async (id) => {
    const problem = await repo.findById(id);
    if (!problem) throw createError('Problem not found', 404);
    await Promise.all([
        repo.deleteProblem(id),
        repo.deleteDescription(id)
    ]);
};

const addTag = async (problemId, tagId) => {
    if (!await repo.findById(problemId)) throw createError('Problem not found', 404);
    return repo.addTag(problemId, tagId);
};

const removeTag = async (problemId, tagId) => {
    return repo.removeTag(problemId, tagId);
};

const getTestCases = async (problemId, type, isAdmin) => {
    if (!await repo.findById(problemId)) throw createError('Problem not found', 404);
    const queryType = isAdmin ? type : 'sample';
    return repo.getTestCases(problemId, queryType);
};

const addTestCase = async (problemId, body) => {
    if (!await repo.findById(problemId)) throw createError('Problem not found', 404);
    return repo.addTestCase({ problemId, ...body });
};

const deleteTestCase = async (problemId, tcId) => {
    const tc = await repo.deleteTestCase(tcId);
    if (!tc) throw createError('Test case not found', 404);
};

module.exports = {
    listProblems, getProblem, createProblem, updateProblem, deleteProblem,
    addTag, removeTag, getTestCases, addTestCase, deleteTestCase
};
