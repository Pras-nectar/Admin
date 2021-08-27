const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    videoConsult: {
        image: { type: String },
        button: { type: String, 
            //required: true 
        }
    },
    exclusiveProduct: {
        image: { type: String },
        button: { type: String,
             //required: true
             }
    },
    liveYoga: {
        image: { type: String },
        button: { type: String, 
            //required: true
         }
    },
    whatsapp: {
        image: { type: String },
        button: { type: String,
             //required: true 
            }
    },
    skinCare: {
        image: { type: String },
        button: { type: String, 
            //required: true 
        }
    }

})

const Service = mongoose.model("Service", ServiceSchema)
module.exports = Service;