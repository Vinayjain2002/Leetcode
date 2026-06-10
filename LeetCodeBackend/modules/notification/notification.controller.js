const notificationService = require('./notification.service');
const ApiResponse = require('../../utils/apiResponse');

const list = async (req, res, next) => {
    try {
        const result = await notificationService.getNotifications(req.user.id, req.query);
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
    try {
        await notificationService.markRead(req.user.id, req.params.id);
        return ApiResponse.success(res, null, 'Marked as read');
    } catch (err) { next(err); }
};

const markAllRead = async (req, res, next) => {
    try {
        await notificationService.markAllRead(req.user.id);
        return ApiResponse.success(res, null, 'All notifications marked as read');
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.user.id, req.params.id);
        return ApiResponse.success(res, null, 'Notification deleted');
    } catch (err) { next(err); }
};

module.exports = { list, markRead, markAllRead, remove };
