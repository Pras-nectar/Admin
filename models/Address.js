const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    fullName: String,
    pincode: Number,
    line1: String,
    line2: String,
    landmark: String,
    city: String,
    town: String,
    state: String,
    isDefault: {
        type: Boolean,
        Default: false
    }
},{ timestamps: true});



const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;