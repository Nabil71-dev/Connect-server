const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    id: String,
    username: String,
    usermail: String,
    no_of_vacancy: String,
    react:[String],
    profile_pic: {
        contentType: String,
        size: Number,
        img:
        {
            data: Buffer
        }
    },
    post_header: {
        type: String,
        required: true,
    },
    post_topic: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    date: String,
    image: {
        contentType: String,
        img:{
            img: Buffer,
            contentType: String,
        }
    }
})

module.exports = postSchema;