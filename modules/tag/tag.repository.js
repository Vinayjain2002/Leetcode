const prisma = require('../../lib/prisma');

const listAll = () =>
    prisma.tag.findMany({
        orderBy: { tagName: 'asc' },
        include: { _count: { select: { problems: true } } }
    });

const findById = (id) => prisma.tag.findUnique({ where: { id } });

const findByName = (tagName) => prisma.tag.findUnique({ where: { tagName } });

const create = (tagName) => prisma.tag.create({ data: { tagName } });

const remove = (id) => prisma.tag.delete({ where: { id } });

module.exports = { listAll, findById, findByName, create, remove };
