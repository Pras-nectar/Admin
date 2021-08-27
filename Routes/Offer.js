const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const { Product } = require("../models");
const catchAsync = require('../utils/catchAsync');

router.get('/getAllOffers', catchAsync(async (req, res) => {

    var prod = [];
    const products = await Product.find({})

    for (let i = 0; i < products.length; i++) {

        for (let j = 0; j < products[i].sku.length; j++) {
            if (products[i].sku[j].offer > 0) {
                prod.push(products[i]);
            }
        }
    }
    res.send({ prod })
})
)

module.exports = router;