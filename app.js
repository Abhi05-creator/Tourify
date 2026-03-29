const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.set('trust proxy', 1)

app.use(cors())
const globalHandler = require('./controllers/errorController')
const AppError = require('./utils/AppError')
const rateLimiter=require("express-rate-limit")
const helmet=require("helmet")
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'img-src': ["'self'", 'data:', 'https://images.unsplash.com']
        }
    }
}))

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

const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});




app.use(globalHandler)

module.exports = app;

