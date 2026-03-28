const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('./models/tourmodel');
const app = require('./app');

const DB_URL = process.env.DATABASE || '';
const DB = DB_URL ? DB_URL.replace('<db_password>', process.env.DATABASE_PASS || '') : '';

if (DB) {
    mongoose.connect(DB).then(() => {
        console.log('DB connection successful!');
    }).catch(err => {
        console.error('DB Connection Error:', err);
    });
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