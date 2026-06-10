const tagService = require('./tag.service');
const ApiResponse = require('../../utils/apiResponse');

const list = async (req, res, next) => {
    try {
        const tags = await tagService.listTags();
        return ApiResponse.success(res, tags);
    } catch (err) { next(err); }
};

const create = async (req, res, next) => {
    try {
        const tag = await tagService.createTag(req.body.tagName);
        return ApiResponse.success(res, tag, 'Tag created', 201);
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        await tagService.deleteTag(req.params.id);
        return ApiResponse.success(res, null, 'Tag deleted');
    } catch (err) { next(err); }
};

module.exports = { list, create, remove };
