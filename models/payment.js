const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    cardInfo:
     {
          cardNumber:{ type: Number, required: true,unique: true},
          expiryDate:{ type: Date, required: true},
          cvc:{ type:Number, required: true,unique: true,maxLength:3}
     },
    country: 
    {
        name: { type: String, required: true},
        pin:{ type:Number, required: true,maxLength:6}
    }
});

const payment = new mongoose.model('payment',paymentSchema);
module.exports = payment;