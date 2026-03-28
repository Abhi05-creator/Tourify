const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'config.env') });
const mongoose = require('mongoose');
const Tour = require('./models/tourmodel');
const app = require('./app');

const DB_URL = process.env.DATABASE || '';
const DB = DB_URL ? DB_URL.replace('<db_password>', process.env.DATABASE_PASS || '') : '';

if (DB) {
    // Disable buffering so we get immediate errors if connection is not ready
    mongoose.set('bufferCommands', false);

    mongoose.connect(DB).then(() => {
        console.log('DB connection successful!');
    }).catch(err => {
        console.error('CRITICAL: DB Connection Failed:', err.message);
    });

    // Connection lifecycle logging
    mongoose.connection.on('error', err => console.error('Mongoose error:', err));
    mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected!'));
    mongoose.connection.on('reconnected', () => console.log('Mongoose reconnected!'));
} else {
    console.error('MongoDB connection skipped: DATABASE environment variable is not set.');
}

const port = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    const server = app.listen(port, () => {
        console.log(`App running on port ${port}...`);
    });
}
module.exports = app;