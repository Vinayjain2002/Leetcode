const prisma = require('../../lib/prisma');

const findById = (id) =>
    prisma.user.findUnique({
        where: { id },
        include: {
            streak: true,
            educations: { include: { university: true } },
            experiences: { include: { company: true } },
            _count: { select: { submissions: true } }
        }
    });

const updateUser = (id, data) =>
    prisma.user.update({ where: { id }, data });

const getStreak = (userId) =>
    prisma.userStreak.findUnique({ where: { userId } });

const upsertStreak = (userId, year, data) =>
    prisma.userStreak.upsert({
        where: { userId },
        update: data,
        create: { userId, year, streakGrid: {}, ...data }
    });

// Education
const addEducation = (data) =>
    prisma.userEducation.create({ data, include: { university: true } });

const deleteEducation = (id, userId) =>
    prisma.userEducation.deleteMany({ where: { id, userId } });

const findOrCreateUniversity = async (instituteName, location) => {
    let uni = await prisma.university.findFirst({ where: { instituteName } });
    if (!uni) uni = await prisma.university.create({ data: { instituteName, location } });
    return uni;
};

// Experience
const addExperience = (data) =>
    prisma.userExperience.create({ data, include: { company: true } });

const deleteExperience = (id, userId) =>
    prisma.userExperience.deleteMany({ where: { id, userId } });

const findOrCreateCompany = async (companyName, location) => {
    let company = await prisma.company.findFirst({ where: { companyName } });
    if (!company) company = await prisma.company.create({ data: { companyName, location } });
    return company;
};

// Stats: accepted per difficulty
const getSolvedStats = (userId) =>
    prisma.submission.groupBy({
        by: ['problemId'],
        where: { userId, status: 'ACCEPTED' },
        _count: true
    });

const getSolvedByDifficulty = async (userId) => {
    const accepted = await prisma.submission.findMany({
        where: { userId, status: 'ACCEPTED' },
        select: { problemId: true },
        distinct: ['problemId']
    });
    const problemIds = accepted.map((s) => s.problemId);
    if (!problemIds.length) return { EASY: 0, MEDIUM: 0, HARD: 0 };

    const problems = await prisma.problem.findMany({
        where: { id: { in: problemIds } },
        select: { difficulty: true }
    });

    return problems.reduce(
        (acc, p) => { acc[p.difficulty] = (acc[p.difficulty] || 0) + 1; return acc; },
        { EASY: 0, MEDIUM: 0, HARD: 0 }
    );
};

module.exports = {
    findById, updateUser,
    getStreak, upsertStreak,
    addEducation, deleteEducation, findOrCreateUniversity,
    addExperience, deleteExperience, findOrCreateCompany,
    getSolvedStats, getSolvedByDifficulty
};
