const repo = require('./leaderboard.repository');

const getByProblems = async ({ page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 100);
    const skip = (Number(page) - 1) * take;
    const [entries, total] = await Promise.all([repo.topByProblems({ skip, take }), repo.totalSolvers()]);
    return { entries, pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) } };
};

const getByCoins = async ({ page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 100);
    const skip = (Number(page) - 1) * take;
    const [entries, total] = await Promise.all([repo.topByCoins({ skip, take }), repo.totalCoinHolders()]);
    return { entries, pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) } };
};

module.exports = { getByProblems, getByCoins };
