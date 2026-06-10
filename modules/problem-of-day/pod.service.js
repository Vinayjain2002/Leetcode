const repo = require('./pod.repository');
const createError = require('../../utils/createError');

const getToday = async () => {
    const pod = await repo.getToday();
    if (!pod) throw createError('No problem of the day set yet', 404);
    const description = await repo.getDescription(pod.problemId);
    return { ...pod, description };
};

const getHistory = async ({ page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * take;
    const [history, total] = await Promise.all([repo.getHistory({ skip, take }), repo.countHistory()]);
    return { history, pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) } };
};

const setToday = async (problemId) => {
    const pod = await repo.setToday(problemId);
    return pod;
};

module.exports = { getToday, getHistory, setToday };
