const mongoose = require("mongoose");
const validator = require("validator")

const PostSchema = new mongoose.Schema({
    author:{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    authorDetails:{
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    isApproved:{
        type:Boolean,
        default:false
    }
})
//collection
const Post = new mongoose.model('Post',PostSchema);

module.exports = Post;