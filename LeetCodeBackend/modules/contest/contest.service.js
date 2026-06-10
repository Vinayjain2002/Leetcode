const repo = require('./contest.repository');
const createError = require('../../utils/createError');

const listContests = async ({ page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 100);
    const skip = (Number(page) - 1) * take;
    const [contests, total] = await Promise.all([repo.list({ skip, take }), repo.count()]);
    return { contests, pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) } };
};

const getContest = async (id) => {
    const contest = await repo.findById(id);
    if (!contest) throw createError('Contest not found', 404);
    return contest;
};

const createContest = (body) => {
    const { title, startsAt, endsAt } = body;
    return repo.create({ title, startsAt: new Date(startsAt), endsAt: new Date(endsAt) });
};

const updateContest = async (id, body) => {
    if (!await repo.findById(id)) throw createError('Contest not found', 404);
    const data = {};
    if (body.title) data.title = body.title;
    if (body.startsAt) data.startsAt = new Date(body.startsAt);
    if (body.endsAt) data.endsAt = new Date(body.endsAt);
    return repo.update(id, data);
};

const deleteContest = async (id) => {
    if (!await repo.findById(id)) throw createError('Contest not found', 404);
    return repo.deleteContest(id);
};

const joinContest = async (contestId, userId) => {
    const contest = await repo.findById(contestId);
    if (!contest) throw createError('Contest not found', 404);
    if (new Date() > new Date(contest.endsAt)) throw createError('Contest has ended', 400);

    const already = await repo.hasJoined(contestId, userId);
    if (already) throw createError('Already joined this contest', 409);

    return repo.joinContest(contestId, userId);
};

const getLeaderboard = async (contestId) => {
    if (!await repo.findById(contestId)) throw createError('Contest not found', 404);
    const entries = await repo.getLeaderboard(contestId);
    return entries.map((e, i) => ({ rank: i + 1, ...e }));
};

const addProblem = async (contestId, problemId, orderIndex) => {
    if (!await repo.findById(contestId)) throw createError('Contest not found', 404);
    return repo.addProblem(contestId, problemId, orderIndex || 0);
};

const removeProblem = async (contestId, problemId) => {
    return repo.removeProblem(contestId, problemId);
};

module.exports = { listContests, getContest, createContest, updateContest, deleteContest, joinContest, getLeaderboard, addProblem, removeProblem };
