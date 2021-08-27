const mongoose = require("mongoose");

const RetailerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required: true
    },
    phoneNo :{
        type:Number
    },
    owner_name:{
        type:String,
        required:true,
        minlength:3
    },
    category_type:{
        type:String,
        required:true
    },
    store_address: [
        {
            country: String,
            state: String,
            city: String,
            town: String,
            line1: String,
            line2: String,
            pincode: Number
        }
    ],
    document_upload:[]
},{ timestamps: true});

const Retailer = new mongoose.model('Retailer',RetailerSchema);

module.exports = Retailer;