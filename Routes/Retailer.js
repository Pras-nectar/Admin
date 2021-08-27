const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const { User, Retailer } = require("../models");

router.get('/getAllRetailers',async(req,res)=>{
    const retailers = await Retailer.find({})
    res.send({retailers});
})

router.post("/new", async (req, res) => {
    console.log(req.body);
    try {
        const retailer = new Retailer(req.body);
        await retailer.save();
        res.status(200).json("Successful");
    } catch (err) {
        res.status(500).json("Some internal error ocurred")
    }
});
router.route('/:id')
    .put(async(req,res)=>{
        const updatedRetailer = await Retailer.findByIdAndUpdate(
                                req.params.id,
                                { ...req.body}, 
                                { new: true });
        await updatedRetailer.save();
        res.send({updatedRetailer})
    })
    .delete(async(req,res)=>{
        try{
            await Retailer.findByIdAndDelete(req.params.id);
            res.send("Deleted!");
        }catch(e){
            res.send(e);
        }
    });

module.exports=router;