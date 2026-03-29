const Tour = require('../models/tourmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAlltours = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    if (req.query.sort) {
        query = query.sort(req.query.sort.split(',').join(' '));
    }

    if (req.query.fields) {
        query = query.select(req.query.fields.split(',').join(' '));
    } else {
        query = query.select('-__v');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const tours = await query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return next(new AppError('No tour found with that ID', 404));
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { tour: newTour }
    });
});

exports.tourUpdate = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!tour) return next(new AppError('No tour found with that ID', 404));
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

exports.deltour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return next(new AppError('No tour found with that ID', 404));
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.tourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        { $sort: { avgPrice: 1 } }
    ]);
    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});

exports.monthlyPlan = catchAsync(async (req, res, next) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const plan = await Tour.aggregate([
        { $unwind: '$startDates' },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        { $addFields: { month: '$_id' } },
        { $project: { _id: 0 } },
        { $sort: { numTourStarts: -1 } },
        { $limit: 12 }
    ]);
    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: { plan }
    });
});
