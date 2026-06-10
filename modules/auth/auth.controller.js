const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        return ApiResponse.success(res, result, 'Registered successfully', 201);
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
        next(err);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) return ApiResponse.error(res, 'Refresh token required', 400);
        const result = await authService.refreshToken(token);
        return ApiResponse.success(res, result);
    } catch (err) {
        next(err);
    }
};

const profile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);
        return ApiResponse.success(res, user);
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, refreshToken, profile };
