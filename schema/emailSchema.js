const mongoose = require("mongoose");
const emailSchema=mongoose.Schema({
    email:String,
    password:String
})

module.exports=emailSchema;