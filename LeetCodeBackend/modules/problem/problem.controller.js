const problemService = require('./problem.service');
const ApiResponse = require('../../utils/apiResponse');

const list = async (req, res, next) => {
    try {
        const { difficulty, tags, search, page, limit } = req.query;
        const result = await problemService.listProblems({ difficulty, tags, search, page, limit });
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
    try {
        const problem = await problemService.getProblem(req.params.id);
        return ApiResponse.success(res, problem);
    } catch (err) { next(err); }
};

const create = async (req, res, next) => {
    try {
        const problem = await problemService.createProblem(req.user.id, req.body);
        return ApiResponse.success(res, problem, 'Problem created', 201);
    } catch (err) { next(err); }
};

const update = async (req, res, next) => {
    try {
        const problem = await problemService.updateProblem(req.params.id, req.body);
        return ApiResponse.success(res, problem, 'Problem updated');
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        await problemService.deleteProblem(req.params.id);
        return ApiResponse.success(res, null, 'Problem deleted');
    } catch (err) { next(err); }
};

const addTag = async (req, res, next) => {
    try {
        await problemService.addTag(req.params.id, req.body.tagId);
        return ApiResponse.success(res, null, 'Tag added');
    } catch (err) { next(err); }
};

const removeTag = async (req, res, next) => {
    try {
        await problemService.removeTag(req.params.id, req.params.tagId);
        return ApiResponse.success(res, null, 'Tag removed');
    } catch (err) { next(err); }
};

const getTestCases = async (req, res, next) => {
    try {
        const isAdmin = req.user?.role === 'ADMIN';
        const tcs = await problemService.getTestCases(req.params.id, req.query.type, isAdmin);
        return ApiResponse.success(res, tcs);
    } catch (err) { next(err); }
};

const addTestCase = async (req, res, next) => {
    try {
        const tc = await problemService.addTestCase(req.params.id, req.body);
        return ApiResponse.success(res, tc, 'Test case added', 201);
    } catch (err) { next(err); }
};

const deleteTestCase = async (req, res, next) => {
    try {
        await problemService.deleteTestCase(req.params.id, req.params.tcId);
        return ApiResponse.success(res, null, 'Test case deleted');
    } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove, addTag, removeTag, getTestCases, addTestCase, deleteTestCase };
