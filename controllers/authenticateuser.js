const User = require('../models/usermodel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

const catchAsync = require('./../utils/catchAsync')
const AppError = require('../utils/AppError')

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    })

    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_expires
    })

    res.status(201).json({
        status: "fulfilled",
        token,
        data: {
            newUser
        }
    })
})

exports.login=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body

    if(!email||!password){
        return next(new AppError("please enter credentials",400))
    }

   const user=await User.findOne({
        email:email
    }).select('+password')

   if(!user||!(await bcrypt.compare(password,user.password))){
    return next(new AppError("incorrect user",400))
   }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_expires
    })
    res.status(200).json({
        status:"fulfilled",
        token
    })
})

exports.protect=catchAsync(async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
         token=req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError("u are not logged in",401))
    }
    const decoded=jwt.verify(token, process.env.JWT_SECRET)

    const existUser= await User.findById(decoded.id)
    if(!existUser){
        return next(new AppError("user does not exist",404))
    }
    if(existUser.passwordChangedAt){
        const changetimestamp=Math.floor(existUser.passwordChangedAt.getTime()/1000)
        if(decoded.iat<changetimestamp){
            return next(new AppError("token is invalid",400))
        }
        
    }
    req.user=existUser

    next()
})


exports.authorize=catchAsync(async(req,res,next)=>{
    if(!req.user.admin){
        return next(new AppError("only access to admins",403))
    }





    next()
})