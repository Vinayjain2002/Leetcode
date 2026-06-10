const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./auth.repository');
const createError = require('../../utils/createError');

const sanitize = ({ passwordHash, ...rest }) => rest;

const generateTokens = (user) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

//Registering user and Creating Streak for the user.
const register = async ({ username, email, password, firstName, lastName }) => {
    const emailTaken = await repo.findByEmail(email);
    if (emailTaken) throw createError('Email already in use', 409);

    const usernameTaken = await repo.findByUsername(username);
    if (usernameTaken) throw createError('Username already taken', 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await repo.createUser({ username, email, passwordHash, firstName, lastName });
    await repo.createStreak(user.id, new Date().getFullYear());

    const tokens = generateTokens(user);
    return { user: sanitize(user), ...tokens };
};

// Logged In user
const login = async ({ email, password }) => {
    const user = await repo.findByEmail(email);
    if (!user) throw createError('Invalid email or password', 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw createError('Invalid email or password', 401);

    const tokens = generateTokens(user);
    return { user: sanitize(user), ...tokens };
};

//Created Refresh Token
const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await repo.findById(decoded.id);
        if (!user) throw new Error('User not found');
        const { accessToken } = generateTokens(user);
        return { accessToken };
    } catch {
        throw createError('Invalid or expired refresh token', 401);
    }
};

// Get Profile of user.
const getProfile = async (id) => {
    const user = await repo.findById(id);
    if (!user) throw createError('User not found', 404);
    return sanitize(user);
};

module.exports = { register, login, refreshToken, getProfile };
