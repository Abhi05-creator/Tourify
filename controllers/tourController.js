
const Tour = require('../models/tourmodel')
const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

exports.getAlltours = catchAsync(async (req, res, next) => {
    const qryObj = { ...req.query }
    const excludefields = ['page', 'sort', 'limit', 'fields']
    excludefields.forEach(el => delete qryObj[el])
    const queryStr = JSON.stringify(qryObj)
    const filteredquery = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)/g, match => "$" + match))

    let query = Tour.find(filteredquery)

    if (req.query.sort) {
        query = query.sort(req.query.sort.split(',').join(" "))
    } else {
        query = query.sort('-createdAt')
    }

    const tours = await query
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})

exports.tourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }
        },
        {
            $group: {
                _id: "$difficulty",
                numTours: { $sum: 1 },
                countAvg: { $avg: "$ratingsAverage" },
                numRatings: { $sum: "$ratingsQuantity" }
            }
        },
        {
            $sort: { countAvg: -1 }
        },
        {
            $limit: 3
        }
    ])

    res.status(200).json({
        status: 'success',
        data: { stats }
    })
})

exports.monthlyPlan = catchAsync(async (req, res, next) => {
    const monthlyTour = await Tour.aggregate([
        {
            $unwind: "$startDates"
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id",
                numTourStarts: 1,
                tours: 1
            }
        },
        {
            $sort: { numTourStarts: -1 }
        }
    ])

    res.status(200).json({
        status: 'success',
        results: monthlyTour.length,
        data: { monthlyTour }
    })
})

exports.tourUpdate = catchAsync(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!updatedTour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: updatedTour
        }
    })
})

exports.deltour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})