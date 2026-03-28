const mongoose = require('mongoose');
const slugify = require("slugify")

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'A tour must have a name'],
        maxlength: [100, 'A tour name must have less or equal than 100 characters'],
        validate: {
            validator: function(val) {
                // Rule: Lowercase, letters, digits, '.', '_', '-' only. No '---'.
                const regex = /^(?![ \s\S]*---)[a-z0-9._-]{1,100}$/;
                return regex.test(val);
            },
            message: 'Project names must be lowercase, max 100 chars, and can only contain letters, digits, ".", "_", or "-". They cannot contain the sequence "---".'
        }
    },
    slug: String,
    duration: {
        type: Number,
        required: true,
    },
    maxGroup: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    rating: {
        type: Number,
        default: 4.3,
        min:[1,"the rating starts from 1"],
        max:[5,"the rating should not exceed 5"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0

    },
    difficulty:{
        type:String,
        required:[true,"the difficulty must be mentioned"],
        enum:{
            values:["easy","medium",'difficult'],
            message:"value should be mentioned"}
    },
    
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)

tourSchema.virtual('durationInWeeks').get(function () {
    return this.duration / 7
})

tourSchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true })
})

tourSchema.pre(/^find/, function () {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
})

tourSchema.post(/^find/, function (docs) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
});

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;
