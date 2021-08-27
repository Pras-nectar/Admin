const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const {Manufacturer} = require("../models");
const { requireToken,isPhoneNoVerified,isAuthorized } = require("../middleware.js")
const catchAsync = require('../utils/catchAsync');

router.get('/getAllManufacturers',async(req,res)=>{
    const manufacturer = await Manufacturer.find({});
    res.send({manufacturer});
})
router.post("/new", async (req, res) => {
    try {
        const manufacturer = new Manufacturer(req.body);
        await manufacturer.save();
        res.status(200).json("Successful");
    } catch (err) {
        res.status(500).json("Some internal error ocurred")
    }
});
router.route('/:id')
  .get(requireToken,/*isPhoneNoVerified(true) ,*/isAuthorized(['SuperAdmin']),catchAsync(async(req,res)=>{
    const manufacturer = await Manufacturer.findById(req.params.id)
    res.send({manufacturer});
  }))
  .put(requireToken,/*isPhoneNoVerified(true),*/isAuthorized(['SuperAdmin']),catchAsync(async(req,res)=>{
    const {name,manufacturerImageURI,features} = req.body;
    let updatedManufacturer;
    if(name){
      updatedManufacturer = await Manufacturer.findByIdAndUpdate(req.params.id,
                            {name,manufacturerImageURI,features},{new:true});
    }
    res.send({updatedManufacturer});
  }))

  .delete(requireToken,/*isPhoneNoVerified(true) ,*/isAuthorized(['SuperAdmin']),catchAsync(async(req,res)=>{
    await Manufacturer.findByIdAndDelete(req.params.id);
    res.send("Manufacturer Deleted");
  }))


module.exports=router;