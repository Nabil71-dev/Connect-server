const mongoose = require("mongoose");
const userSchema=mongoose.Schema({
    fullname:String,
    username:String,
    usermail: String,
    profile_pic:{
        contentType:String,
        size:Number,
        img:
        {
            data: Buffer,
            contentType: String
        }
    },
    personalweb:String,
    department_name:String,
    batch_no:String,
    job_title: {
        type:String,
        enum:['active','inactive']
    },
    working_stack:String,
    compnay_city:String,
    working:{
        company_name:String,
        job_post:String
    },
    profile_links:{
        github:String,
        linkedin:String,
        cf:String,
        leetcode:String,
        hackerrank:String
    },
    personal_description:String,
    cv:{
        contentType:String,
        size:Number,
        img:
        {
            data: Buffer,
            contentType: String
        }
    }
})

module.exports=userSchema;