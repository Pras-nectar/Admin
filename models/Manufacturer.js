const mongoose = require('mongoose');

const ManufacturerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    manufacturerImageURI : {
        type: String
    },
    features:[
        {
            heading: String,
            imageURI: String,
            details: String
        }
    ]
},{ timestamps: true});


const Manufacturer = mongoose.model('Manufacturer', ManufacturerSchema);
module.exports = Manufacturer;