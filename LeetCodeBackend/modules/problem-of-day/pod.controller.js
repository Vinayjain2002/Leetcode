const podService = require('./pod.service');
const ApiResponse = require('../../utils/apiResponse');

const getToday = async (req, res, next) => {
    try {
        const pod = await podService.getToday();
        return ApiResponse.success(res, pod);
    } catch (err) { next(err); }
};

const getHistory = async (req, res, next) => {
    try {
        const result = await podService.getHistory(req.query);
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

const setToday = async (req, res, next) => {
    try {
        const pod = await podService.setToday(req.body.problemId);
        return ApiResponse.success(res, pod, 'Problem of the day set', 201);
    } catch (err) { next(err); }
};

module.exports = { getToday, getHistory, setToday };
