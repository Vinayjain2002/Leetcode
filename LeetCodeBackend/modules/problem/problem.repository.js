const prisma = require('../../lib/prisma');
const ProblemDescription = require('../../models/ProblemDescription');
const ProblemTestCase = require('../../models/ProblemTestCase');

// ─── PostgreSQL (Prisma) ────────────────────────────────────────────────────

const listProblems = ({ difficulty, tagIds, search, skip, take }) => {
    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (tagIds && tagIds.length) {
        where.tags = { some: { tagId: { in: tagIds } } };
    }

    return prisma.problem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
            tags: { include: { tag: true } },
            _count: { select: { submissions: true } }
        }
    });
};

const countProblems = ({ difficulty, tagIds, search }) => {
    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (tagIds && tagIds.length) {
        where.tags = { some: { tagId: { in: tagIds } } };
    }
    return prisma.problem.count({ where });
};

const findById = (id) =>
    prisma.problem.findUnique({
        where: { id },
        include: {
            tags: { include: { tag: true } },
            createdBy: { select: { id: true, username: true, firstName: true } },
            _count: { select: { submissions: true } }
        }
    });

const createProblem = (data) =>
    prisma.problem.create({ data, include: { tags: { include: { tag: true } } } });

const updateProblem = (id, data) =>
    prisma.problem.update({ where: { id }, data });

const deleteProblem = (id) =>
    prisma.problem.delete({ where: { id } });

const addTag = (problemId, tagId) =>
    prisma.problemTag.create({ data: { problemId, tagId } });

const removeTag = (problemId, tagId) =>
    prisma.problemTag.delete({ where: { problemId_tagId: { problemId, tagId } } });

// Accepted / total submissions for acceptance rate
const getAcceptanceRate = async (problemId) => {
    const [total, accepted] = await Promise.all([
        prisma.submission.count({ where: { problemId } }),
        prisma.submission.count({ where: { problemId, status: 'ACCEPTED' } })
    ]);
    return total ? Math.round((accepted / total) * 100) : 0;
};

// ─── MongoDB ────────────────────────────────────────────────────────────────

const getDescription = (problemId) =>
    ProblemDescription.findOne({ problemId });

const upsertDescription = (problemId, data) =>
    ProblemDescription.findOneAndUpdate(
        { problemId },
        { ...data, problemId },
        { upsert: true, new: true }
    );

const deleteDescription = (problemId) =>
    ProblemDescription.deleteOne({ problemId });

const getTestCases = (problemId, type) => {
    const filter = { problemId };
    if (type) filter.type = type;
    return ProblemTestCase.find(filter);
};

const addTestCase = (data) =>
    ProblemTestCase.create(data);

const deleteTestCase = (id) =>
    ProblemTestCase.findByIdAndDelete(id);

module.exports = {
    listProblems, countProblems, findById, createProblem, updateProblem, deleteProblem,
    addTag, removeTag, getAcceptanceRate,
    getDescription, upsertDescription, deleteDescription,
    getTestCases, addTestCase, deleteTestCase
};
