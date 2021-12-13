const express = require("express")
const {authenticate} = require("../../middleware/auth")
const router = new express.Router()
const { userRegister, loginUser, updateUser, deleteUser, queryUser} = require("./utils")

router.post("/user/register", async (req, res)=>{
    try{
        const request = req.body
        console.log("/user/register", request)
        const newUser = await userRegister(
            request.email,
            request.nickname,
            request.password
        )
        res.status(200).send({
            status: true,
            message: "Usuario registrado con éxito",
            data: {
                email: newUser.email,
                name: newUser.name,
                token: newUser.token
            }
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Registro fallido",
            data: {error: error.toString()}
        })
    }
})

router.post("/user/login", async (req, res)=>{
    try {
        const request = req.body
        console.log("/user/login", request)
        const loggedUser = await loginUser(
            request.email,
            request.password
        )
        res.status(200).send({
            status: true,
            message: "Usuario logueado con éxito",
            data: {
                email: loggedUser.email,
                name: loggedUser.name,
                token: loggedUser.token
            }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Ingreso fallido",
            data: {error: error.toString()}
        })
    }
})

router.patch("/user/update", authenticate, async (req, res) => {
    try {
        const request = req.body
        console.log("/user/update", request)
        const updatedUser = await updateUser(
            req.headers["email"],
            request.imageUrl,
            request.password,
            request.newPassword
        )
        res.status(200).send({
            status: true,
            message: "Usuario actualizado con éxito",
            data: {
                imageUrl: updatedUser.imageUrl
            }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Actualización falló",
            data: { error: error.toString() }
        })
    }
}) 

router.delete("/user/delete", authenticate, async (req, res) => {
    try {
        const request = req.body
        console.log("/user/delete", request)
        await deleteUser(
            req.headers["email"],
            request.password
        )
        res.status(200).send({
            status: true,
            message: "Usuario eliminado con éxito",
            data: {}
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Eliminación falló",
            data: { error: error.toString() }
        })
    }
}) 

router.get("/user/:userNickname", authenticate, async (req, res) => {
    try {
        const request = req.body
        const params = req.params
        console.log("/user/:userNickname", request)
        const user = await queryUser(
            params.userNickname
        )
        res.status(200).send({
            status: true,
            message: "Usuario consultado con éxito",
            data: {user}
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Consulta falló",
            data: { error: error.toString() }
        })
    }
}) 

module.exports = router