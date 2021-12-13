const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    nickname:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 16,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: RegExp(/^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/)
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(){
            if(this.password==this.name){
                throw new Error("La contraseña no puede ser igual que tu usuario")
            }
            if(this.password=="12345678"){
                throw new Error("La contraseña no puede ser 12345678")
            }
        }
    },
    imageUrl: {
        type: String,
    },
    token: {
        type: String
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User