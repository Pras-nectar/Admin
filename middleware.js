const mongoose = require('mongoose');
const createError = require('http-errors')
const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_KEY

const {User,Appointment,Post} = require("./models")
const catchAsync = require("./utils/catchAsync");
const { ModelBuildInstance } = require('twilio/lib/rest/autopilot/v1/assistant/modelBuild');

module.exports.isAuthorized = function(users){
    return (req, res, next) => {
        for(let i=0;i<users.length;i++){
            if(req.user.role === users[i])
                return next();
        }
        return next(createError(403, 'Not Allowed to view this page.'))
    }
}

module.exports.isPhoneNoVerified = function(bool){
    return (req, res, next) => {
        if(req.user.isPhoneNoVerified !== bool){
            return res.status(401).send({error:`Phone no is ${bool? "not verified" : "already verified"}`})
        }
        next();
    }
}

module.exports.requireToken = (req,res,next)=>{
       const { authorization } = req.headers;
       if(!authorization){
          return res.status(401).send({error:"Token is required"})
       }
       const token = authorization.split(" ")[1];
       jwt.verify(token,jwtkey,async (err,payload)=>{
           if(err){
             return  res.status(401).send({error:"Invalid Token"})
           }
        const {userId} = payload;
        const user = await User.findById(userId)
        if(!user){
         return  res.status(401).send({error:"Invalid token"})
       }
        req.user=user;
        next();
       })
}


module.exports.isDocAuthor = catchAsync(async(req,res,next)=>{
    const appointment = await Appointment.findById(req.params.id)
                                                .populate({path: "doctor"})
                                                .populate({path: "customer"});
    if(!appointment)
        return next(createError(404, 'Doesnt exist'))
    if(!String(appointment.doctor._id)!== String(req.user._id))
        return next(createError(403, 'User not authorized.'))
    next();
})

module.exports.isPostAuthor = catchAsync(async(req,res,next)=>{
    const post = await Post.findById(req.params.id).populate({path: "author"})
    if(!post)
        return next(createError(404, 'Doesnt exist'))
    console.log(post)
    console.log(req.user._id)
    if(String(post.author._id) !== String(req.user._id))
        return next(createError(403, 'User not authorized.'))
    next();
})
