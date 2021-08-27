const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const { User, Post } = require("../models");

router.get('/all', async (req, res) => {
    const { dbType } = req.query;
    // console.log(dbType)
    if (dbType === 'Doctor') {
        const doctors = await User.find({ role: 'Doctor', "doctor.isApproved": false }).populate({path: "address"});
        res.send({ doctors });
    } else
    if (dbType === 'Post') {
        const posts = await Post.find({ isApproved: false });
        res.send({ posts });
        }
})

router.post("/doc/:id", async (req, res) => {
    console.log("i am")
    try {
        const { approved } = req.body;
        const user = await User.findById(req.params.id);
        if (user.role === 'Doctor' && user.doctor.isApproved === false) {
            if (approved === false){
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("Rejected")
            } else
            if (approved === true) {
                user.doctor.isApproved = true;
                res.status(200).json("Approved")
                await user.save();
            }
        }else{
            res.status(501).send({error: "Not a doctor or already approved"})
        }
    } catch (err) {
        res.status(500).json("error occurred");
    }
});


router.post("/post/:id", async (req, res) => {
    try {
        const { approved } = req.body;
        const post = await Post.findById(req.params.id);
        if (post.isApproved === false) {
            if (approved === false){
                await Post.findByIdAndDelete(req.params.id)
            } else
            if (approved === true) {
                post.isApproved = true;
                await post.save();
            }
            res.status(200).json({ post })
        }else{
            res.status(501).send({error: "Not a valid post"})
        }
    } catch (err) {
        res.status(500).json("error occurred");
    }
});










// router.get("/approval-status/:id/approve/:type", async (req, res) => {
//     try {
//         if (req.params.type === "post") {
//             const post = await Post.findByIdAndUpdate(req.params.id, { approve: true }, function (err, result) {
//                 if (err) {
//                     res.status(200).json("Successful");
//                 } else {
//                     res.send(result)
//                 }
//             });
//             await post.save();
//         } else if (req.params.type === "doc") {
//             const post = await Doc.findByIdAndUpdate(req.params.id, { approve: true }, function (err, result) {
//                 if (err) {
//                     res.status(200).json("Successful");
//                 } else {
//                     res.send(result)
//                 }
//             });
//             await post.save();
//         }
//     } catch (err) {
//         res.status(500).json("Some internal error ocurred");
//         console.log(err);
//     }
// });
// router.get("/approval-status/:id/reject/:type", async (req, res) => {
//     console.log("id", req.params.id)
//     console.log("type", req.params.type)
//     try {
//         if (req.params.type === "post") {
//             const reject = Post.findById(req.params.id, function (error, person) {
//                 console.log(error)
//                 person.remove()
//             });
//         } else if (req.params.type === "doc") {
//             const reject = Doc.findById(req.params.id, function (error, person) {
//                 console.log(error)
//                 person.remove()
//             });
//             res.status(200).json("data deleted")
//         }
//     } catch (err) {
//         res.status(500).json("Some internal error ocurred")
//         console.log(err)
//     }
// });
module.exports = router;