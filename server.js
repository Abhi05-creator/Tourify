const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, 'config.env') });
}

const mongoose = require('mongoose');
const app = require('./app');

const DB_URL = process.env.DATABASE || '';
const DB = DB_URL ? DB_URL.replace('<db_password>', process.env.DATABASE_PASS || '') : '';

if (DB) {
    mongoose.set('bufferCommands', false);

    mongoose.connect(DB).then(() => {
        console.log('DB connection successful!');
    }).catch(err => {
        console.error('CRITICAL: DB Connection Failed:', err.message);
    });

    mongoose.connection.on('error', err => console.error('Mongoose error:', err));
    mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected!'));
    mongoose.connection.on('reconnected', () => console.log('Mongoose reconnected!'));
} else {
    console.error('MongoDB connection skipped: DATABASE environment variable is not set.');
}

const port = process.env.PORT || 5000;
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`App running on port ${port}...`);
});

module.exports = app;
