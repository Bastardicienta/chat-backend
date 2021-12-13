const jwt = require("jsonwebtoken")

function authenticate(req, res, next){
    try {
        const token = req.headers["accestoken"]
        const email = req.headers["email"]
        const nickname = req.headers["nickname"]
        if(email == null){
            throw new Error("Error. No se envió correo")
        }
        if(nickname == null){
            throw new Error("Error. No se envió usuario")
        }
        if(token == null){
            throw new Error("Error. No se envió token")
        }
        let auth
        try {
            const auth = jwt.verify(token, process.env.SIGN_PASSWORD)
        } catch (error) {
            throw new Error("Firma inválida")
        }
        if(auth == null || auth.email != email || auth.nickname != nickname){
            throw new Error("Error. El token no es válido")
        }
        return next
    } catch (error) {
        console.log(error)
        res.status(401).send({
            status: false,
            message: "Autenticación inválida",
            data: {error: error.toString()}
        })
    }
}

module.exports = {authenticate}