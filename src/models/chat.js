const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true //opcional
    },
    users:[
        {
            nickname:{
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 16,
            },
            email:{
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                match: RegExp(/^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/)
            },
            imageUrl: {
                type: String,
            }
        }
    ],
    adminNickname:{
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    messages:[
        {
            id: {
                type: String,
                required: true
            },
            sender: {
                nickname:{
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 3,
                    maxlength: 16,
                },
                email:{
                    type: String,
                    required: true,
                    trim: true,
                    lowercase: true,
                    match: RegExp(/^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/)
                },
                imageUrl: {
                    type: String,
                }
            },
            date:{
                type: Number,
                require: true
            },
            body:{
                type: String,
                require: true
            }
        }
    ],
})

const Chat = mongoose.model("Chat", chatSchema)
module.exports = Chat