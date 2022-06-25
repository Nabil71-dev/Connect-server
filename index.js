const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const cors=require('cors')
const bodyparser=require('body-parser')

//body parser, cors add on express
app.use(express.json());
app.use(cors())
app.use(bodyparser.json())

//routes
const userRouter = require('./routehandler/userHandler');
const postRouter= require('./routehandler/postHandler');
const email_auth_Router=require('./routehandler/emailHandler_Auth')

//database connection with mongoose
mongoose.connect(`mongodb://localhost/${process.env.DB_Name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log("Connection successfull") })
    .catch(() => { console.log("Connection error") })


app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/email', email_auth_Router);

//Conect with local server
app.listen(`${process.env.Local_Host}`, () => {
    console.log('Sever running');
})