const express = require('express');
const mongoose = require("mongoose");
const userRouter = express.Router();
const fileupload = require('express-fileupload')

const userSchema = require("../schema/userSchema");
const userCollection = new mongoose.model('user', userSchema)
const checkLogin = require('../middleware/checkLogin')

userRouter.use(fileupload());
//Get all the user who are looking for a job
userRouter.get('/active', checkLogin, (req, res) => {
    userCollection.find({ job_title: "active" }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else {
            res.status(200).json({
                result: data
            })
        }
    })
});

//Get all the user who are employeed in different different company
userRouter.get('/employee', checkLogin, (req, res) => {
    userCollection.find({ "working.company_name": { $ne: null } }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else {
            res.status(200).json({
                result: data
            })
        }
    })
});

//Get specific user's details
userRouter.get('/userprofile/:email', checkLogin, (req, res) => {
    userCollection.find({ usermail: req.params.email }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else {
            res.status(200).json({
                result: data
            })
        }
    })
});

//edit & update profile {first get that specific data send to client and then update}
userRouter.get('/editprofile/:email', checkLogin, async (req, res) => {
    postCollection.find({ usermail: req.params.email }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else if (data) {
            res.status(200).send({
                result: data
            });
        }
    })
})
userRouter.post('/updateprofile/:email', checkLogin, (req, res) => {
    const req_user = req.body

    userCollection.updateOne(
        { usermail: req.params.email },
        {
            $set: {
                username: req_user.username, fullname: req_user.fullname, personalweb: req_user.personalweb,
                department_name: req_user.department_name, batch_no: req_user.batch_no, "working.job_status": req_user.job_status,
                "working.compnay_name": req_user.compnay_name, working_stack: req_user.working_stack, compnay_city: req_user.compnay_city,
                "profile_links.github": req_user.github, "profile_links.linkedin": req_user.linkdin, "profile_links.codeforces": req_user.codeforce,
                "profile_links.hackerrank": req_user.hackerrank, "profile_links.leetcode": req_user.leetcode, personal_description: req_user.personal_description
            }
        }, (err, result) => {
            if (err) {
                res.status(500).josn({
                    message: "There was a server side error!"
                })
            }
            else if (result) {
                res.status(200).json({
                    message: "Post update successful"
                });
            }
        })
})

//Profile_pic change
userRouter.post('/profilepic/:email', checkLogin, (req, res) => {

    let file = req.files.user_pic;
    const newImg = file.data;
    const encodedImg = newImg.toString('base64');
    let profile_pic = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encodedImg, 'base64')
    }
    userCollection.updateOne(
        { usermail: req.params.email },
        {
            $set: {
                "profile_pic.contentType": profile_pic.contentType,
                "profile_pic.size": profile_pic.size,
                "profile_pic.img": profile_pic.img,
            }
        }, (err, result) => {
            if (err) {
                res.status(500).josn({
                    message: "There was a server side error!"
                })
            }
            else if (result) {
                res.status(200).json({
                    message: "Profile picture updated successfully"
                });
            }
        })
})
//CV change
userRouter.post('/cv/:email', checkLogin, (req, res) => {
    let file = req.files.cv;
    const newImg = file.data;
    const encodedImg = newImg.toString('base64');
    let cv = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encodedImg, 'base64')
    }
    userCollection.updateOne(
        { usermail: req.params.email },
        {
            $set: {
                "cv.contentType": cv.contentType,
                "cv.size": cv.size,
                "cv.img": cv.img,
            }
        }, (err, result) => {
            if (err) {
                res.status(500).josn({
                    message: "There was a server side error!"
                })
            }
            else if (result) {
                res.status(200).json({
                    message: "CV updated successfully"
                });
            }
        })

})

//Search with username
userRouter.post('/search', checkLogin, (req, res) => {
    userCollection.find({username: RegExp(`${req.body.name}`, 'i') }, (err, result) => {
            if (err) {
                //console.log(err)
                res.status(500).josn({
                    message: "There was a server side error!"
                })
            }
            else if (result) {
                res.status(200).json({
                    data: result
                });
            }
        })

})

module.exports = userRouter;