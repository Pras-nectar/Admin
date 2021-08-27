const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const {User,Address} = require("../models")
const {requireToken,isPhoneNoVerified,isAuthorized,isDocAuthor,isAddressAuthor} = require("../middleware.js")
const catchAsync = require("../utils/catchAsync");

router.route('/:id')
  .get(requireToken,/*isPhoneNoVerified(true) ,*/isAuthorized(['SuperAdmin']),catchAsync(async(req,res)=>{
    const user = await User.findById(req.params.id).populate({path: "address"}).populate({path: "recentlyViewed"});
    res.send({user});
  }))
  .put(requireToken,/*isPhoneNoVerified(true),*/isAuthorized(['SuperAdmin']),catchAsync(async(req,res)=>{
    const {username,doctor} = req.body;
    let updatedUser;
    if(doctor && username){
      const {doctorName,picture,specialization,experience,about,documents} = doctor
      updatedUser = await User.findByIdAndUpdate(req.params.id,
          {username,doctor : {doctorName,picture,specialization,experience,about,documents}},{new:true});
    }else 
    if(username){
      updatedUser = await User.findByIdAndUpdate(req.params.id,
        {username},{new:true});
    }
    res.send({updatedUser});
  }))
  .delete(requireToken,/*isPhoneNoVerified(true) ,*/isAuthorized(['SuperAdmin']),catchAsync(async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.send("User Deleted");
  }))
    
module.exports = router;