const submissionService = require('./submission.service');
const ApiResponse = require('../../utils/apiResponse');

const submit = async (req, res, next) => {
    try {
        const submission = await submissionService.submit(req.user.id, req.body);
        return ApiResponse.success(res, submission, 'Submission received', 201);
    } catch (err) { next(err); }
};

const runCode = async (req, res, next) => {
    try {
        const result = await submissionService.runCode(req.user.id, req.body);
        return ApiResponse.success(res, result, 'Code executed against sample cases');
    } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
    try {
        const submission = await submissionService.getSubmission(req.user.id, req.params.id);
        return ApiResponse.success(res, submission);
    } catch (err) { next(err); }
};

const list = async (req, res, next) => {
    try {
        const { problemId, status, page, limit } = req.query;
        const result = await submissionService.listSubmissions(req.user.id, { problemId, status, page, limit });
        return ApiResponse.success(res, result);
    } catch (err) { next(err); }
};

module.exports = { submit, runCode, getOne, list };
