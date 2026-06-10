const repo = require('./notification.repository');

const getNotifications = async (userId, { page = 1, limit = 20 }) => {
    const take = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * take;
    const [notifications, total, unread] = await Promise.all([
        repo.list({ userId, skip, take }),
        repo.count(userId),
        repo.unreadCount(userId)
    ]);
    return { notifications, unread, pagination: { total, page: Number(page), limit: take, pages: Math.ceil(total / take) } };
};

const markRead = (userId, id) => repo.markRead(id, userId);

const markAllRead = (userId) => repo.markAllRead(userId);

const deleteNotification = (userId, id) => repo.remove(id, userId);

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };
