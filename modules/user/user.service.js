const repo = require('./user.repository');
const createError = require('../../utils/createError');

const sanitize = ({ passwordHash, ...rest }) => rest;

const getProfile = async (id) => {
    const user = await repo.findById(id);
    if (!user) throw createError('User not found', 404);
    const solvedByDifficulty = await repo.getSolvedByDifficulty(id);
    return { ...sanitize(user), solvedByDifficulty };
};

const updateProfile = async (id, data) => {
    const allowed = ['firstName', 'lastName', 'profilePicture', 'title', 'summary'];
    const filtered = Object.fromEntries(
        Object.entries(data).filter(([k]) => allowed.includes(k))
    );
    const updated = await repo.updateUser(id, filtered);
    return sanitize(updated);
};

const getStreak = async (userId) => {
    const streak = await repo.getStreak(userId);
    if (!streak) throw createError('Streak not found', 404);
    return streak;
};

const addEducation = async (userId, body) => {
    const { instituteName, location, degree, startYear, endYear, gradeValue } = body;
    const university = await repo.findOrCreateUniversity(instituteName, location);
    return repo.addEducation({ userId, universityId: university.id, degree, startYear, endYear, gradeValue });
};

const deleteEducation = async (userId, id) => {
    const count = await repo.deleteEducation(id, userId);
    if (count.count === 0) throw createError('Education record not found', 404);
};

const addExperience = async (userId, body) => {
    const { companyName, location, role, department, isCurrent, startDate, endDate } = body;
    const company = await repo.findOrCreateCompany(companyName, location);
    return repo.addExperience({
        userId, companyId: company.id, role, department,
        isCurrent: !!isCurrent,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
    });
};

const deleteExperience = async (userId, id) => {
    const count = await repo.deleteExperience(id, userId);
    if (count.count === 0) throw createError('Experience record not found', 404);
};

module.exports = { getProfile, updateProfile, getStreak, addEducation, deleteEducation, addExperience, deleteExperience };
