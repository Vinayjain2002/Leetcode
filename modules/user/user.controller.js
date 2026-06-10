const userService = require('./user.service');
const ApiResponse = require('../../utils/apiResponse');

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.params.id);
        return ApiResponse.success(res, user);
    } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        return ApiResponse.success(res, user, 'Profile updated');
    } catch (err) { next(err); }
};

const getStreak = async (req, res, next) => {
    try {
        const streak = await userService.getStreak(req.user.id);
        return ApiResponse.success(res, streak);
    } catch (err) { next(err); }
};

const addEducation = async (req, res, next) => {
    try {
        const edu = await userService.addEducation(req.user.id, req.body);
        return ApiResponse.success(res, edu, 'Education added', 201);
    } catch (err) { next(err); }
};

const deleteEducation = async (req, res, next) => {
    try {
        await userService.deleteEducation(req.user.id, req.params.id);
        return ApiResponse.success(res, null, 'Education removed');
    } catch (err) { next(err); }
};

const addExperience = async (req, res, next) => {
    try {
        const exp = await userService.addExperience(req.user.id, req.body);
        return ApiResponse.success(res, exp, 'Experience added', 201);
    } catch (err) { next(err); }
};

const deleteExperience = async (req, res, next) => {
    try {
        await userService.deleteExperience(req.user.id, req.params.id);
        return ApiResponse.success(res, null, 'Experience removed');
    } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getStreak, addEducation, deleteEducation, addExperience, deleteExperience };
