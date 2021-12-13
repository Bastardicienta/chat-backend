const express = require("express")
const {authenticate} = require("../../middleware/auth")
const router = new express.Router()
const {createGroup, addGroupMember, deleteGroup, queryChatGroup, queryChatGroups, queryChatGroupsByNickname} = require("./utils")

//Crear grupo
router.post("/chat/create-group", authenticate, async (req, res)=>{
    try{
        const request = req.body
        console.log("/chat/create-group", request)
        const createdGroup = await createGroup(
            request.name,
            request.adminNickname,
            request.adminUser,
            request.initialMessage,
        )
        res.status(200).send({
            status: true,
            message: "Grupo registrado con éxito",
            data: {chat: createdGroup}
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Creación de grupo fallido",
            data: {error: error.toString()}
        })
    }
})

//Agregar miembro
router.patch("/chat/add-group-member", authenticate, async (req, res)=>{
    try{
        const request = req.body
        console.log("/chat/add-group-member", request)
        const updatedGroup = await addGroupMember(
            request.groupName,
            request.newMember
        )
        res.status(200).send({
            status: true,
            message: "Miembro agregado con éxito",
            data: {users: updatedGroup.users}
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falla al agregar miembro",
            data: {error: error.toString()}
        })
    }
})

//Eliminar grupo
router.delete("/chat/delete-group", authenticate, async (req, res)=>{
    try{
        const request = req.body
        console.log("/chat/delete-group", request)
        await deleteGroup(
            request.groupName,
            request.adminNickname,
            request.adminPassword
        )
        res.status(200).send({
            status: true,
            message: "Grupo eliminado con éxito",
            data: {}
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falla al eliminar grupo",
            data: {error: error.toString()}
        })
    }
})

//Consultar todos los chats
router.get("/chat/all", authenticate, async (req, res)=>{
    try{
        const request = req.body
        const params = req.params
        console.log("/chat/all", request)
        const queriedChats = await queryChatGroups()
        res.status(200).send({
            status: true,
            message: "Chats consultados con éxito",
            data: {chat: queriedChats}
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falla al consultar grupos",
            data: {error: error.toString()}
        })
    }
})

//Consultar chat completo
router.get("/chat/:chatName", authenticate, async (req, res)=>{
    try{
        const request = req.body
        const params = req.params
        console.log("/chat/:chatName", request)
        const queriedChat = await queryChatGroup(
            params.chatName
        )
        res.status(200).send({
            status: true,
            message: "Chat consultado con éxito",
            data: {chat: queriedChat}
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falla al consultar grupo",
            data: {error: error.toString()}
        })
    }
})

//Consultar chats de un usuario
router.get("/chat/user/:userNickname", authenticate, async (req, res)=>{
    try{
        const request = req.body
        const params = req.params
        console.log("/chat/user/:userNickname", request)
        const queriedChat = await queryChatGroupsByNickname(
            params.userNickname
        )
        res.status(200).send({
            status: true,
            message: "Chats consultados con éxito",
            data: {chat: queriedChat}
        })
    }catch (error){
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falla al consultar grupos",
            data: {error: error.toString()}
        })
    }
})

//Enviar mensaje al grupo

module.exports = router