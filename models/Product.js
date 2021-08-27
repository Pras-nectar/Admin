const mongoose = require("mongoose");
const reviews = require("./Review");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    require: true,
  },
  retailer: {
    ref: "Retailer",
    type: mongoose.Schema.Types.ObjectId,
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer"
  },
  description: [
    String,
    //require: true,
  ],
  isExclusive: {
    type: Boolean,
    default: false
  },
  ingredient: {
    type: String,
    //require: true,
  },
  category: {
    ref: "Category",
    type: mongoose.Schema.Types.ObjectId,
  },
  rating: Number,
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],

  sku: [
    {
      lengths: {
        type: Number,
        //require: true,
      },
      lengthType: {
        type: String,
        enum: ["cm","m","mm"]
      },
      breadth: {
        type: Number,
        //require: true,
      },
      breadthType: {
        type: String,
        enum: ["cm","m","mm"]
      },
      height: {
        type: Number,
        //require: true,
      },
      heightType: {
        type: String,
        enum: ["cm","m","mm"]
      },
      base_price: {
        type: Number,
        //require: true,
      },
      final_price: {
        type: Number,
      },
      offer: {
        type: Number,
        //require: true,
      },
      netQuantity: {
        type: String,
        //required: true,
      },
      itemVolume:{
        type: Number
      },
      itemVolumeType: {
        type: String,
        enum: ["ml","l","kl"]
      },
      itemWeight:{
        type: Number,
        //required: true,
      },
      itemWeightType: {
        type: String,
        enum: ["mg","kg","g"]
      },
      country: {
        type: String,
        //required: true,
      },
      includedComponents: [
        String
      ],
      inStock: {
        type: Boolean,
        //required: true,
      },
      deliveryCharge: {
        type: Number,
        //require: true,
      },
      manufactureDate: {
        type: Date,
        //require: true,
        default: Date.now()
      },
      expiryDate: {
        type: Date,
        //require: true,
        default: Date.now()
      },
      releaseDate: {
        type: Date,
        //require: true,
        default: Date.now()
      },
      numberOfUnit: {
        type: Number,
        //require: true,
      },
      returnable:{
        type:Boolean,
        default: true,

      },
      lotNumber: {
        type: String,
        //require: true,
      },
      images: [
        String
      ],
    },
  ]
});

//collection

const Product = new mongoose.model("Product", ProductSchema);

module.exports = Product;