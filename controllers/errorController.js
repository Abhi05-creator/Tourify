const AppError = require('./../utils/AppError');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.name === "ValidationError") err = new AppError(err.message, 400);
    if (err.name === "CastError") err = new AppError("invalid id", 404);
    if (err.code === 11000) err = new AppError("Duplicate field", 400);
    if(err.name==="JsonWebTokenError") err=new AppError("invalid token",401)
    if(err.name=="TokenExpiredError") err=new AppError("timeout",401)

    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.isOperational ? err.message : "something is wrong"
    });
};