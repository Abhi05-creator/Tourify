const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/AppError')
const User = require('../models/usermodel')


exports.Deleteme=catchAsync(async(req,res,next)=>{
    const delme=await User.findByIdAndUpdate(req.user.id,{active:false})
    res.status(204).json({
        status:"fulfilled",
        data:null

    })
})

exports.getAllusers = catchAsync(async(req, res, next) => {
    const newusers=await User.find({active:true})
    res.status(200).json({
        status:"fulfilled",
        data:newusers
    })
    
    
})

exports.createUsers = (req, res, next) => {
    next(new AppError('This route is not yet defined!', 500))
}

exports.getUser = (req, res, next) => {
    next(new AppError('This route is not yet defined!', 500))
}

exports.updateUser = catchAsync(async(req, res, next) => {
    
    next(new AppError('This route is not yet defined!', 500))
})

exports.delUser = (req, res, next) => {
    next(new AppError('This route is not yet defined!', 500))
}
