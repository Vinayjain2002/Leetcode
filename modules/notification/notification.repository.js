const prisma = require('../../lib/prisma');

const list = ({ userId, skip, take }) =>
    prisma.notification.findMany({
        where: { userId },
        skip, take,
        orderBy: { createdAt: 'desc' }
    });

const count = (userId) => prisma.notification.count({ where: { userId } });

const unreadCount = (userId) => prisma.notification.count({ where: { userId, isRead: false } });

const markRead = (id, userId) =>
    prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });

const markAllRead = (userId) =>
    prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });

const remove = (id, userId) =>
    prisma.notification.deleteMany({ where: { id, userId } });

const create = (data) => prisma.notification.create({ data });

module.exports = { list, count, unreadCount, markRead, markAllRead, remove, create };
