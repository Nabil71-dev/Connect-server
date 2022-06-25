const express = require('express');
const mongoose = require("mongoose");
const email_auth_Router = express.Router();
const bcrypt = require("bcrypt");
const generateJWT = require('../token/JWTGenerator');

const emailSchema = require("../schema/emailSchema");
const emailCollection = new mongoose.model('emailUser', emailSchema)
//signup with hashed password
email_auth_Router.post('/reg', (req, res) => {
    emailCollection.findOne({ email: req.body.email }, (err, result) => {
        if (result) {
            res.status(409).json({
                message: "This email has already been taken"
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        message: "Couldn't hash the password"
                    });
                }
                else if (hash) {
                    req.body.password = hash
                    const newUser = new emailCollection(req.body)
                    newUser.save((err) => {
                        if (err) {
                            res.status(502).send({
                                message: "Error occured while creating the user"
                            });
                        }
                        else {
                            res.status(200).json({
                                message: "User created successfully"
                            });
                        }
                    })
                }
            });
        }
    })
});

//login with JWT return
email_auth_Router.post('/login', (req, res) => {
    const req_user = req.body;
    emailCollection.find({ email: req_user.user_email }, (err, data) => {
        if (err) {
            res.status(403).json({
                message: "Authentication error!"
            })
        }
        else {
            bcrypt.compare(req_user.user_password, data[0].password, (err,success) => {
                if (success) {
                    const token = generateJWT(req_user.user_email)
                    res.status(200).json({
                        access_token: token,
                        message: "Authentication successfull"
                    });
                }
                else {
                    res.status(401).json({
                        message: "Authentication error!"
                    });
                }
            });
        }
    })
})

//token send for Gmail signed user
email_auth_Router.get('/gmaillogin', async (req, res) => {
    try {
        const req_user = req.body
        const token = await generateJWT(req_user.email)
        res.status(200).json({
            access_token: token,
            message: "Authentication successfull"
        });
    }
    catch {
        res.status(401).json({
            message: "Authentication error!"
        });
    }
})

module.exports = email_auth_Router;