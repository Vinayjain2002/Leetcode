const prisma = require('../../lib/prisma');
const ProblemDescription = require('../../models/ProblemDescription');

const todayStart = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const getToday = () =>
    prisma.problemOfDay.findUnique({
        where: { date: todayStart() },
        include: {
            problem: {
                include: { tags: { include: { tag: true } } }
            }
        }
    });

const getHistory = ({ skip, take }) =>
    prisma.problemOfDay.findMany({
        skip, take,
        orderBy: { date: 'desc' },
        include: { problem: { select: { id: true, title: true, difficulty: true } } }
    });

const countHistory = () => prisma.problemOfDay.count();

const setToday = (problemId) =>
    prisma.problemOfDay.upsert({
        where: { date: todayStart() },
        update: { problemId },
        create: { date: todayStart(), problemId }
    });

const getDescription = (problemId) =>
    ProblemDescription.findOne({ problemId });

module.exports = { getToday, getHistory, countHistory, setToday, getDescription };
