const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
    imageURIs: [ 
        String,
    ]
},{toJSON: { virtuals: true }, timestamps: true});


const Carousel = mongoose.model('Carousel', CarouselSchema);
module.exports = Carousel;