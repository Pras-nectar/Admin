
const mongoose = require("mongoose")
const WishListSchema = new mongoose.Schema({
    Wish : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
})

const Wishlist = new mongoose.model('Wishlist', WishListSchema);
module.exports = Wishlist