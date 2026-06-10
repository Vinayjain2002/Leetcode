const contestService = require('./contest.service');
const ApiResponse = require('../../utils/apiResponse');

const list = async (req, res, next) => {
    try {
        const result = await contestService.listContests(req.query);
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
    try {
        const contest = await contestService.getContest(req.params.id);
        return ApiResponse.success(res, contest);
    } catch (err) { next(err); }
};

const create = async (req, res, next) => {
    try {
        const contest = await contestService.createContest(req.body);
        return ApiResponse.success(res, contest, 'Contest created', 201);
    } catch (err) { next(err); }
};

const update = async (req, res, next) => {
    try {
        const contest = await contestService.updateContest(req.params.id, req.body);
        return ApiResponse.success(res, contest, 'Contest updated');
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        await contestService.deleteContest(req.params.id);
        return ApiResponse.success(res, null, 'Contest deleted');
    } catch (err) { next(err); }
};

const join = async (req, res, next) => {
    try {
        const entry = await contestService.joinContest(req.params.id, req.user.id);
        return ApiResponse.success(res, entry, 'Joined contest', 201);
    } catch (err) { next(err); }
};

const getLeaderboard = async (req, res, next) => {
    try {
        const board = await contestService.getLeaderboard(req.params.id);
        return ApiResponse.success(res, board);
    } catch (err) { next(err); }
};

const addProblem = async (req, res, next) => {
    try {
        const cp = await contestService.addProblem(req.params.id, req.body.problemId, req.body.orderIndex);
        return ApiResponse.success(res, cp, 'Problem added to contest', 201);
    } catch (err) { next(err); }
};

const removeProblem = async (req, res, next) => {
    try {
        await contestService.removeProblem(req.params.id, req.params.problemId);
        return ApiResponse.success(res, null, 'Problem removed from contest');
    } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove, join, getLeaderboard, addProblem, removeProblem };
