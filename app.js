const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
const globalHandler = require('./controllers/errorController')
const AppError = require('./utils/AppError')
const rateLimiter=require("express-rate-limit")
const helmet=require("helmet")
app.use(helmet())

app.use(express.json())

const limit=rateLimiter({
    max:100,
    windowMs:60*60*1000,
    message:"too many requests"
})

app.use("/api",limit)




const tourRouter = require('./routers/tourroute')
const userRouter = require("./routers/userroute")



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}










app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

// ONLY serve static files through Express when NOT on Vercel
// Vercel will handle serving the React frontend through its own static hosting
if (!process.env.VERCEL) {
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.all('(.*)', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
    });
}




app.use(globalHandler)

module.exports = app;

