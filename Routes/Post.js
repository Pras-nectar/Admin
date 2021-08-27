const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const {User,Post} = require("../models");
const {requireToken,isPhoneNoVerified,isPostAuthor,isAuthorized} = require("../middleware.js")

router.get('/getAllPosts',async(req,res)=>{
    const posts = await Post.find({});
    res.send({posts});
})

router.route('/new')
.post(requireToken,isAuthorized(['Admin','SuperAdmin']),async (req, res) => {
    try {
        const {title,content} = req.body;
        const author = req.user._id;
        const newPost = new Post({author,title,content})
        await newPost.save();
        return res.status(200).json({newPost})
    } catch (err) {
        return res.status(500).json("Some internal error ocurred");
    }
})   
router.route('/:id')
    .put(requireToken,isAuthorized(['Admin','SuperAdmin']),async(req,res)=>{
        const {title,content} = req.body
        const updatedPost = await Post.findByIdAndUpdate(
                                req.params.id,
                                { title,content}, 
                                { new: true });
        await updatedPost.save();
        return res.send({updatedPost})
    })
    .delete(requireToken,isAuthorized(['Admin','SuperAdmin']),async(req,res)=>{
        try{
            await Post.findByIdAndDelete(req.params.id);
            return res.send("Deleted!");
        }catch(e){
            return res.send(e);
        }
    });

module.exports = router;