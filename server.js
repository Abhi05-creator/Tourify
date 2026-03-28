const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('./models/tourmodel');
const app = require('./app');

const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASS);

mongoose.connect(DB).then(() => {
    console.log('DB connection successful!');
});




const port = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    const server = app.listen(port, () => {
        console.log(`App running on port ${port}...`);
    });
}
module.exports = app;