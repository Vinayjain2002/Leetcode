const prisma = require('../../lib/prisma');

const getTransactions = ({ userId, skip, take }) =>
    prisma.coinTransaction.findMany({
        where: { userId },
        skip, take,
        orderBy: { createdAt: 'desc' }
    });

const countTransactions = (userId) =>
    prisma.coinTransaction.count({ where: { userId } });

const getBalance = async (userId) => {
    const result = await prisma.coinTransaction.aggregate({
        where: { userId },
        _sum: { amount: true }
    });
    return result._sum.amount || 0;
};

module.exports = { getTransactions, countTransactions, getBalance };
