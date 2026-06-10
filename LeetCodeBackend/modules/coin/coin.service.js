const repo = require('./coin.repository');

const getWallet = async (userId) => {
    const [balance, recent] = await Promise.all([
        repo.getBalance(userId),
        repo.getTransactions({ userId, skip: 0, take: 5 })
    ]);
    return { balance, recentTransactions: recent };
};

const getTransactions = async (userId, { page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * take;
    const [transactions, total] = await Promise.all([
        repo.getTransactions({ userId, skip, take }),
        repo.countTransactions(userId)
    ]);
    const balance = await repo.getBalance(userId);
    return { balance, transactions, pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) } };
};

module.exports = { getWallet, getTransactions };
