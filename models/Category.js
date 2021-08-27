const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category1: {
        type: String,
        required: true,
    },
    category2: {
        type: String,
        required: true,
    },
    category3: {
        type: String,
        required: true,
    },
    category4: {
        type: String,
        required: true,
    },
    category5: {
        type: String,
        required: true,
    },
    imageURI: {
        type: String,
    }
},{toJSON: { virtuals: true }, timestamps: true});


CategorySchema.virtual("productsOfCatg", {
    ref: "Product",
    foreignField: "category",
    localField: "_id"
});


const Category = new mongoose.model('Category', CategorySchema);
module.exports = Category;