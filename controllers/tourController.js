// Optimized getAlltours function in tourController.js

// ... other imports

const getAllTours = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tours = await Tour.find()  // Replace `Tour` with your model
            .lean()  // For plain objects
            .select('name price location')  // Choose fields to return
            .skip(skip)  // Pagination
            .limit(limit);  // Limit results

        const totalTours = await Tour.countDocuments();

        res.status(200).json({
            totalTours,
            totalPages: Math.ceil(totalTours / limit),
            currentPage: page,
            tours
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... other functions remain unchanged
