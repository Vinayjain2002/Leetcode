const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimmiter.js');
const errorMiddleware = require('./middleware/errorMiddleware.js');

const authRouter = require('./modules/auth/auth.route.js');
const userRouter = require('./modules/user/user.route.js');
const problemRouter = require('./modules/problem/problem.route.js');
const submissionRouter = require('./modules/submission/submission.route.js');
const contestRouter = require('./modules/contest/contest.route.js');
const tagRouter = require('./modules/tag/tag.route.js');
const notificationRouter = require('./modules/notification/notification.route.js');
const coinRouter = require('./modules/coin/coin.route.js');
const leaderboardRouter = require('./modules/leaderboard/leaderboard.route.js');
const podRouter = require('./modules/problem-of-day/pod.route.js');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

app.get('/health', (req, res) => {
    return res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/problems', problemRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/contests', contestRouter);
app.use('/api/tags', tagRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/coins', coinRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/problem-of-day', podRouter);

// Error handler must be last
app.use(errorMiddleware);

module.exports = app;
