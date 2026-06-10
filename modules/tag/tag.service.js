const repo = require('./tag.repository');
const createError = require('../../utils/createError');

const listTags = () => repo.listAll();

const createTag = async (tagName) => {
    const existing = await repo.findByName(tagName.trim());
    if (existing) throw createError('Tag already exists', 409);
    return repo.create(tagName.trim());
};

const deleteTag = async (id) => {
    if (!await repo.findById(id)) throw createError('Tag not found', 404);
    return repo.remove(id);
};

module.exports = { listTags, createTag, deleteTag };
