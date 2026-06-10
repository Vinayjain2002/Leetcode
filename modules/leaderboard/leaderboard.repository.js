const prisma = require('../../lib/prisma');

// Top users by unique problems solved (accepted)
const topByProblems = async ({ skip, take }) => {
    const rows = await prisma.submission.groupBy({
        by: ['userId', 'problemId'],
        where: { status: 'ACCEPTED' },
        _count: true
    });

    // Count unique problems per user
    const userMap = {};
    for (const row of rows) {
        userMap[row.userId] = (userMap[row.userId] || 0) + 1;
    }

    const sorted = Object.entries(userMap)
        .sort((a, b) => b[1] - a[1])
        .slice(skip, skip + take);

    const users = await prisma.user.findMany({
        where: { id: { in: sorted.map(([id]) => id) } },
        select: { id: true, username: true, firstName: true, lastName: true, profilePicture: true, isTopVoice: true }
    });

    const userById = Object.fromEntries(users.map((u) => [u.id, u]));

    return sorted.map(([userId, solved], i) => ({
        rank: skip + i + 1,
        user: userById[userId],
        solved
    }));
};

// Total unique users who have solved at least one problem
const totalSolvers = async () => {
    const rows = await prisma.submission.groupBy({
        by: ['userId'],
        where: { status: 'ACCEPTED' }
    });
    return rows.length;
};

// Top users by coin balance
const topByCoins = async ({ skip, take }) => {
    const rows = await prisma.coinTransaction.groupBy({
        by: ['userId'],
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        skip,
        take
    });

    const users = await prisma.user.findMany({
        where: { id: { in: rows.map((r) => r.userId) } },
        select: { id: true, username: true, firstName: true, lastName: true, profilePicture: true }
    });

    const userById = Object.fromEntries(users.map((u) => [u.id, u]));

    return rows.map((row, i) => ({
        rank: skip + i + 1,
        user: userById[row.userId],
        coins: row._sum.amount || 0
    }));
};

const totalCoinHolders = () =>
    prisma.coinTransaction.groupBy({ by: ['userId'] }).then((r) => r.length);

module.exports = { topByProblems, totalSolvers, topByCoins, totalCoinHolders };
