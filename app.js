const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
const globalHandler = require('./controllers/errorController')
const AppError = require('./utils/AppError')
const rateLimiter=require("express-rate-limit")
const helmet=require("helmet")
const datasanitize=require("express-mongo-sanitize")

app.use(helmet())

app.use(express.json())

const limit=rateLimiter({
    max:100,
    windowMs:60*60*1000,
    message:"too many requests"
})

app.use("/api",limit)

app.use(datasanitize())




const tourRouter = require('./routers/tourroute')
const userRouter = require("./routers/userroute")



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}










app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all(/(.*)/,(req,res,next)=>{
    next(new AppError(`cant find ${req.originalUrl}`,404))
})



app.use(globalHandler)

module.exports = app;

