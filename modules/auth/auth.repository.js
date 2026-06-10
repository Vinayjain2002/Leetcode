const prisma = require('../../lib/prisma');

const createUser = (data) =>
    prisma.user.create({ data });

const findByEmail = (email) =>
    prisma.user.findUnique({ where: { email } });

const findByUsername = (username) =>
    prisma.user.findUnique({ where: { username } });

const findById = (id) =>
    prisma.user.findUnique({ where: { id } });

const createStreak = (userId, year) =>
    prisma.userStreak.create({
        data: { userId, year, streakGrid: {} }
    });

module.exports = { createUser, findByEmail, findByUsername, findById, createStreak };
