const express = require('express');
const mongoose = require("mongoose");
const postRouter = express.Router();
const fileUpload = require('express-fileupload')
const userSchema = require("../schema/userSchema");
const userCollection = new mongoose.model('user', userSchema)
const postSchema = require("../schema/postSchema");
const postCollection = new mongoose.model('Postnoimg', postSchema, 'posts')
const checkLogin = require('../middleware/checkLogin')
//file upload and save in a folder
postRouter.use(fileUpload());

//Function to add current username and profile pic on existing post
const addProfileData = (myResult, response) => {
    if (myResult.length === 0) {
        response.status(200).json({
            message: "No post availabe"
        });
    }
    else {
        let c = 0;
        myResult.map(value => {
            userCollection.find({ usermail: value.usermail }, (err, data) => {
                if (err) {
                    res.status(500).json({
                        message: "There was a server side error!"
                    })
                }
                else if (data) {
                    value.username = data[0].username
                    value.profile_pic = data[0].profile_pic
                    ++c;
                    if (c === myResult.length) {
                        response.status(200).json({
                            result: myResult
                        });
                    }
                }
            })
        })
    }
}

//Get all post
postRouter.get('/', checkLogin, (req, res) => {
    postCollection.find({}).sort({ "date": -1 })
        .then((data, err) => {
            if (data) {
                addProfileData(data, res);
            }
            else if (err) {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//Get all the post whose post topic is Ai & Ml
postRouter.get('/aiml', checkLogin, (req, res) => {
    postCollection.find({ post_topic: "Ai-ML" }).sort({ "date": -1 })
        .then((data, err) => {
            if (data) {
                addProfileData(data, res);
            }
            else if (err) {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//Get all the post whose post topic is Software
postRouter.get('/software', checkLogin, (req, res) => {
    postCollection.find({ post_topic: "Software" }).sort({ "date": -1 })
        .then((data, err) => {
            if (data) {
                addProfileData(data, res);
            }
            else if (err) {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//Get all the post whose post topic is Job_Post
postRouter.get('/jobpost', checkLogin, (req, res) => {
    postCollection.find({ post_topic: "Job-Post" }).sort({ "date": -1 })
        .then((data, err) => {
            if (data) {
                addProfileData(data, res);
            }
            else if (err) {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//Get all the post whose post topic is others
postRouter.get('/others', checkLogin, (req, res) => {
    postCollection.find({ post_topic: "Others" }).sort({ "date": -1 })
        .then((data, err) => {
            if (data) {
                addProfileData(data, res);
            }
            else if (err) {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//Get all the post whose post topic is Distributed_System
postRouter.get('/distributedsys', checkLogin, (req, res) => {
    postCollection.find({ post_topic: "Distributed-system" }).sort({ "date": -1 })
        .then((data, err) => {
            if (data) {
                addProfileData(data, res);
            }
            else if (err) {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//top 3 reacted posts
postRouter.get('/reactpost', checkLogin, (req, res) => {
    postCollection.aggregate([
        {
            $project: {
                react: { $size: "$react" }, id: '$id', ct: { $sum: 1 }, usermail: '$usermail',
                post_header: '$post_header', post_topic: '$post_topic', post: '$post', date: '$date'
            }
        },
        { $sort: { react: -1 } }]).limit(3)
        .then((myResult) => {
            if (myResult) {
                addProfileData(myResult, res)
            }
            else {
                console.log(err.message)
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//recent 3 job posts
postRouter.get('/recentjob', checkLogin, (req, res) => {
    postCollection.find({ post_topic: "Job-Post" }).sort({ "date": -1 }).limit(3)
        .then((data) => {
            if (data) {
                addProfileData(data, res);
            }
            else {
                res.status(500).json({
                    message: "There was a server side error!"
                })
            }
        })
});

//Insert a new post without image
postRouter.post('/addpostnoimg',checkLogin, async (req, res) => {
    const newPost = new postCollection(req.body)
    await newPost.save((err) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else {
            res.status(200).json({
                message: "Data inserted successfully"
            })
        }
    })
})

//Insert a new post with image
postRouter.post('/addpostimg',checkLogin, async (req, res) => {
    let file = req.files.file;
    const id = req.body.id;
    const post_header = req.body.post_header[0];
    const post_topic = req.body.post_topic[0];
    const post = req.body.post[0];
    const usermail = req.body.usermail;
    const date = req.body.date;

    const newImg = file.data;
    const encodedImg = newImg.toString('base64');
    let image = {
        img: {
            data: Buffer.from(encodedImg, 'base64'),
            contentType: file.mimetype,
        }
    }
    const data = {
        id, post_header, post_topic, post, usermail, date, image
    }
    if (post_topic === 'Job-Post') {
        data.no_of_vacancy = req.body.no_of_vacancy
    }
    const postimgSchema = new mongoose.Schema({
        id: String,
        usermail: String,
        no_of_vacancy: String,
        react: [String],
        post_header: { type: String, required: true, },
        post_topic: { type: String, required: true, },
        post: { type: String, required: true, },
        date: String,
        image: { img: { data: Buffer, contentType: String } }
    })
    let pCollection
    try {
        pCollection = mongoose.model('postimg')
    } catch (error) {
        pCollection = mongoose.model('postimg', postimgSchema, 'posts')
    }
    const newPost = new pCollection(data)
    await newPost.save((err) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else {
            res.status(200).json({
                message: "Data inserted successfully"
            })
        }
    })
})

//Get all the post as clicked users mail
postRouter.get('/userspost/:email',checkLogin, (req, res) => {
    postCollection.find({ usermail: req.params.email }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else if (data) {
            addProfileData(data, res);
        }
    })
})

//edit & update post {first get that specific data send to client and then update}
postRouter.get('/editpost/:id',checkLogin, (req, res) => {
    postCollection.find({ id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else if (data) {
            res.status(200).json({
                result: data
            });
        }
    })
})
postRouter.post('/updatepost/:id',checkLogin, (req, res) => {
    const post_header = req.body.post_header;
    const post_topic = req.body.post_topic;
    const post = req.body.post;
    postCollection.updateOne(
        { id: req.params.id },
        { $set: { post_header: post_header, post_topic: post_topic, post: post } }, (err, result) => {
            if (err) {
                res.status(500).josn({
                    message: "There was a server side error!"
                })
            }
            else if (result) {
                res.status(200).json({
                    data: result,
                    message: "Post update successful"
                });
            }
        })
})

//delete post
postRouter.delete('/deletepost',checkLogin, async (req, res) => {
    try {
        const req_user = req.body
        await postCollection.findOneAndDelete({ id: req_user.id })
        res.status(200).json({
            message: "Post deletion successful"
        });
    }
    catch {
        res.status(500).json({
            message: "There was a server side error!"
        })
    }
})

//Like on a post
postRouter.put('/react/:id',checkLogin, (req, res) => {
    postCollection.updateOne(
        { id: req.params.id },
        { $push: { react: req.body.usermail } },
        { new: true }, (err, result) => {
            if (err) {
                res.status(500).josn({
                    message: "There was a server side error!"
                })
            }
            else if (result) {
                res.status(200).json({
                    message: "You have liked"
                });
            }
        })
})

//Get specific post
postRouter.get('/toppost/:id',checkLogin, (req, res) => {
    postCollection.find({ id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error!"
            })
        }
        else if (data) {
            addProfileData(data, res);
        }
    })
})
module.exports = postRouter;