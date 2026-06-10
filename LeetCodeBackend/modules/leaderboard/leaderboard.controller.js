const leaderboardService = require('./leaderboard.service');
const ApiResponse = require('../../utils/apiResponse');

const byProblems = async (req, res, next) => {
    try {
        const result = await leaderboardService.getByProblems(req.query);
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

const byCoins = async (req, res, next) => {
    try {
        const result = await leaderboardService.getByCoins(req.query);
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

module.exports = { byProblems, byCoins };
