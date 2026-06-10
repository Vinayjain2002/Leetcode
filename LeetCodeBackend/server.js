require('dotenv').config();

const app = require('./app.js');
const prisma = require('./LeetCodeBackend/lib/prisma.js');
const connectMongo = require('./config/mongodb.js');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('PostgreSQL connected via Prisma');

        await connectMongo();

        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    } catch (err) {
        console.error('Server start failed:', err);
        process.exit(1);
    }
}

startServer();
