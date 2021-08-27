const express = require('express')
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const jwtkey = process.env.JWT_KEY
const router = express.Router();
const {User,Address} = require("../models")
const {requireToken,isPhoneNoVerified,isAuthorized} = require("../middleware.js")
const catchAsync = require("../utils/catchAsync")
const client = require('twilio')(process.env.A_SID, process.env.AUTH_TOKEN)

router.post('/register', catchAsync(async (req, res) => {
    const { email, password, username, role = "Customer", phoneNo } = req.body;
    if (!email || !password) {
      return res.status(422).send({ error: "Must provide email or password" })
    }
    const user = await User.findOne({ email })
    if (user && !user.isPhoneNoVerified) {
      return res.status(422).send({ error: "Already registered! Please login and verify your phone no" })
    } else if (user) {
      return res.status(422).send({ error: "Already registered! Please login" })

    }

    try {
      const user = new User({ email, password, username, role, phoneNo });
      await user.save();
      const token = jwt.sign({ userId: user._id }, jwtkey)
      const USER = {name : user.username,email: user.email,role: user.role}
      res.send({ token ,USER})

    } catch (err) {
      return res.status(422).send(err.message)
    }
  }))

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).send({ error: "Must provide email or password" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(422).send({ error: "Please register yourself first" })
    }
    try {
      try{
        await user.comparePassword(password);
      }catch(e){
        return res.status(422).send({error: "Incorrect password"});
      }
      const USER = {
        id:user._id,
        name : user.username,
        email: user.email,
        role: user.role,
        isPhoneNoVerified: user.isPhoneNoVerified,
        phoneNo : user.phoneNo
      }
      const token = jwt.sign({ userId: user._id }, jwtkey)
      res.send({ token, USER})
    } catch (err) {
      return res.status(422).send({ error: "Something went wrong, please try again" })
    }
  })

router.route('/verifyPhoneNo')
      .get(requireToken,isPhoneNoVerified(false),async (req, res) => {
        const user = req.user
         client
          .verify
          .services(process.env.SID)
          .verifications
          .create({
            to: `+91${user.phoneNo}`,
            channel: 'sms'
          })
          .then(data => {
            res.send({ success: `OTP sent successfully!` });
          },reason =>{
            res.status(501).send({ error: reason });
          })
      
      })
      .post(requireToken,isPhoneNoVerified(false),async (req, res) => {
        const user = req.user
        if(user.isPhoneNoVerified){
          return res.status(422).send({ error: "Phone no is already verified" })
        }
        if (!user) {
          return res.status(422).send({ error: "User isn't logged in for phone no verification" })
        }else if(!req.body.code){
          return res.status(422).send({ error: "Please pass a OTP code" })
        }
        if ((req.body.code).length === 6) {
          try {
            client
              .verify
              .services(process.env.SID)
              .verificationChecks
              .create({
                to: `+91${user.phoneNo}`,
                code: req.body.code
              })
              .then(async (data) => {
                if (data.status === "approved") {
                  const newUser = await User.findById(user._id)
                  newUser.isPhoneNoVerified = true
                  await newUser.save()
                  const USER = {
                    name : newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    isPhoneNoVerified: newUser.isPhoneNoVerified,
                    phoneNo : newUser.phoneNo
                  }
                  res.send({ success: "OTP approved" ,USER})
                }
                else {
                  res.send({ success: "OTP is incorrect" })
                }
              },reason =>{
                res.status(501).send({ error: reason });
              })
          } catch (e) {
            res.status(504).send({ error: "Generate OTP again" })
          }

        } else {
          res.status(401).send({ error: "OTP is incorect" })
        }
      })

router.get('/getAllUsers',async(req,res)=>{
        const {userRole} = req.query;
        const users = await User.find({role : userRole});
        res.send({users});
    })

router.post('/doctor_register',requireToken, isAuthorized(['SuperAdmin']), catchAsync(async (req, res) => {
      const { email, password, username, phoneNo ,doctor,address} = req.body;
      if (!email || !password) {
        return res.status(422).send({ error: "Must provide email or password" })
      }
      if (!username) {
        return res.status(422).send({ error: "Must provide username" })
      }
      if(!address)
      {
        return res.status(422).send({ error: "Must provide address" })
      }
      const user = await User.findOne({ email })
      if (user && !user.isPhoneNoVerified) {
        return res.status(422).send({ error: "Already registered! Please login and verify your phone no" })
      } else if (user) {
        return res.status(422).send({ error: "Already registered! Please login" })
    
      }
    
      try {
        if(!doctor.doctorName){
          return res.status(422).send({ error: "Must provide doctor name" })
        }
        const user = new User({ email, password, username, role: "Doctor", phoneNo ,doctor});
        const {fullName,pincode,line1,line2,landmark,city,town,state,isDefault } =address;
        const newAddress = new Address({user,fullName,pincode,line1,line2,landmark,city,town,state,isDefault:true})
        user.address.push(newAddress)
        await newAddress.save();
        await user.save();
        const token = jwt.sign({ userId: user._id }, jwtkey)
        const USER = await user.getInfo();
        res.send({ token ,USER})
    
      } catch (err) {
        return res.status(422).send(err.message)
      }
    }))

module.exports = router

//611a0b82d5ab3b0f985092d0

