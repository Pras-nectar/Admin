// products: array,
// orderStatus: String : ["Executed","Dispatched","Delivered","Payment Settled"]
// returnStatus: String : ["Executed","Dispatched","Delivered","Payment Settled"]
// transaction:
// user:
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    items: [
        {
            product: {
                ref: "Product",
                type: mongoose.Schema.Types.ObjectId
            },
            skuID: String,
            Quantity: {
                type: Number,
                default: 1
            },
            base_price: Number,
            offer: Number,
            final_price:Number,
            productOrderStatus: {
                type: String,
                enum: ["Order Placed","Executed","Dispatched","Delivered","Payment Settled","Refunded"]
            },      
            isReturned: {
                type:Boolean,
                default: false
            },
            productReturnStatus: {
                type: String,
                enum: ["Executed","Taken","Returned","Payment Settled"]
            },
        }
    ],
    transactionDetails: {
        // payment: {
        //     ref: "Payment",
        //     type: mongoose.Schema.Types.ObjectId
        // },
        total_base_price: Number,
        total_offer: Number,
        total_final_price:Number
    },
    shippingAddress: {
        fullName: String,
        pincode: Number,
        line1: String,
        line2: String,
        landmark: String,
        city: String,
        town: String,
        state: String,
    },
    trackingID: String,
    shippingService: String,
},{ timestamps: true});

// OrderSchema.pre('save', function (next) {
//     try{
//       for(let i=0;i<this.items.length;i++){
//         this.transactionDetails.total_base_price += this.items[i].base_price;
//         this.transactionDetails.total_final_price += this.items[i].final_price;
//         this.transactionDetails.total_offer += this.items[i].offer;
//       }
//       return next()
//     }catch(err){
//       return next(err);
//     }
//   })

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;