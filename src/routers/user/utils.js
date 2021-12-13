const User = require("../../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { error } = require("console")

async function userRegister(nickname, email, password){
    const hashedPassword = await hashPasword(password).catch((error) => {
        console.log(error)
        throw new Error(`Error hasheando la contraseña. ${error}`)
    })
    const token = createToken(email, nickname)
    const user = await User.create({
        nickname,
        email,
        password: hashedPassword,
        token
    }).catch((error)=>{
        console.log(error)
        throw new Error(`Error registrando al usuario. ${error}`)
    })
    return {email, nickname, token}
}

async function hashPasword(password){
    return await bcrypt.hash(password, 5)
}

async function verifyHashedPassword(password, storedPassword){
    return await bcrypt.compare(password, storedPassword)
}

function createToken(email, nickname) {
    const token = jwt.sign({email, nickname}, process.env.SIGN_PASSWORD)
    return token
}

async function loginUser(email, password){
    const user = bcrypt.findOne({email}).catch((error) => {
        console.log(error)
        throw new Error(`Error encontrando al usuario. ${error}`)
    })
    const passwordMatch = await verifyHashedPassword(password, user.password)
    if(passwordMatch === false){
        throw new Error(`Error: Contraseña incorrecta`)
    }
    const token = createToken(email, user.nickname)
    user.token = token
    await user.save().catch ((error) => {
        console.log(error)
        throw new Error(`Error guardando nuevo token. ${error}`)
    })
    return {email, nickname: user.nickname, token}
}

async function updateUser(email, imageUrl, password, newPassword){
    if(imageUrl != null || newPassword != null){
        const user = await User.findOne({email}).catch ((error) => {
            console.log(error)
            throw new Error(`Error encontrando al usuario. ${error}`)
        })
        if(user == null){
            throw new Error(`Error usuario no encontrado`)
        }
        if(newPassword != null){
            const passwordMatch = await verifyHashedPassword(
                password,
                user.password
            )
            if(passwordMatch == false){
                throw new Error(`Error contraseña incorrecta`)
            }
            const hashedPassword = await hashPasword(newPassword).catch((error)=>{
                console.log(error)
                throw new Error(`Error hasheando la nueva contraseña. ${error}`)
            })
            user.password = hashedPassword
        }
        if(imageUrl != null){
            user.imageUrl = imageUrl
        }
        user.save()
    }
    else{
        throw new Error("Error no se enviaron cambios")
    }
    return {imageUrl}
}

async function deleteUser(email, password){
    const user = await User.findOne({email}).catch ((error) => {
        console.log(error)
        throw new Error(`Error encontrando al usuario. ${error}`)
    })
    if(user == null){
        throw new Error(`Error usuario no encontrado`)
    }
    const passwordMatch = await verifyHashedPassword(
        password,
        user.password
    )
    if(passwordMatch === false){
        throw new Error(`Error contraseña incorrecta`)
    }
    user.remove().catch((error) =>{
        throw new Error(`Error no se pudo eliminar`)
    })
    return
}

async function queryUser(nickname) {
    const user = await User.findOne({ nickname }).catch((error) => {
        console.log(error)
        throw new Error(`Error encontrando usuario ${error}`)
    })
    if (user == null) {
        throw new Error(`Error usuario no encontrado`)
    }
    const returnedUser = {
        email: user.email,
        nickname: user.nickname,
        imageUrl: user.imageUrl
    }
    return returnedUser
}

async function queryCompleteUser(nickname) {
    const user = await User.findOne({ nickname }).catch((error) => {
        console.log(error)
        throw new Error(`Error encontrando usuario ${error}`)
    })
    if (user == null) {
        throw new Error(`Error usuario no encontrado`)
    }
    const returnedUser = {
        email: user.email,
        nickname: user.nickname,
        imageUrl: user.imageUrl,
        password: user.password
    }
    return returnedUser
}

module.exports = {userRegister, loginUser, updateUser, deleteUser, queryUser, queryCompleteUser, verifyHashedPassword}