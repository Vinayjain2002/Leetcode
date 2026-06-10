const coinService = require('./coin.service');
const ApiResponse = require('../../utils/apiResponse');

const getWallet = async (req, res, next) => {
    try {
        const wallet = await coinService.getWallet(req.user.id);
        return ApiResponse.success(res, wallet);
    } catch (err) { next(err); }
};

const getTransactions = async (req, res, next) => {
    try {
        const result = await coinService.getTransactions(req.user.id, req.query);
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

module.exports = { getWallet, getTransactions };
