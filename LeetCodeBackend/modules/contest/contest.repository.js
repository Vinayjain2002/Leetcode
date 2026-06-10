const prisma = require('../../lib/prisma');

const list = ({ skip, take }) =>
    prisma.contest.findMany({
        skip, take,
        orderBy: { startsAt: 'desc' },
        include: { _count: { select: { participants: true, problems: true } } }
    });

const count = () => prisma.contest.count();

const findById = (id) =>
    prisma.contest.findUnique({
        where: { id },
        include: {
            problems: { orderBy: { orderIndex: 'asc' }, include: { problem: { select: { id: true, title: true, difficulty: true } } } },
            _count: { select: { participants: true } }
        }
    });

const create = (data) =>
    prisma.contest.create({ data });

const update = (id, data) =>
    prisma.contest.update({ where: { id }, data });

const deleteContest = (id) =>
    prisma.contest.delete({ where: { id } });

const joinContest = (contestId, userId) =>
    prisma.userContest.create({ data: { contestId, userId } });

const hasJoined = (contestId, userId) =>
    prisma.userContest.findUnique({ where: { contestId_userId: { contestId, userId } } });

const getLeaderboard = (contestId) =>
    prisma.userContest.findMany({
        where: { contestId },
        orderBy: [{ score: 'desc' }, { joinedAt: 'asc' }],
        include: { user: { select: { id: true, username: true, firstName: true, profilePicture: true } } }
    });

const addProblem = (contestId, problemId, orderIndex) =>
    prisma.contestProblem.create({ data: { contestId, problemId, orderIndex } });

const removeProblem = (contestId, problemId) =>
    prisma.contestProblem.delete({ where: { contestId_problemId: { contestId, problemId } } });

module.exports = { list, count, findById, create, update, deleteContest, joinContest, hasJoined, getLeaderboard, addProblem, removeProblem };
