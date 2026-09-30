const express = require('express')
const {Server} = require('socket.io')
const {createServer} =require('http')
const cors = require('cors')
const { randomUUID } = require("crypto");
require('dotenv').config()
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'


const app = express()
const server = createServer(app)
const io = new Server(server,{cors:{
  origin:CLIENT_ORIGIN ,
  methods:['POST','GET'],
  credentials:true
}})

app.use(cors({
  origin:CLIENT_ORIGIN,
  methods: ['GET', 'POST'],
  credentials:true
}))

io.on('connection',(socket)=>{
  socket.on('message',(text)=>{
    if(typeof text !=='string') return
    const clean = text.trim().slice(0,200)
    if(!clean) return
  io.emit('message',{id:randomUUID(),text:clean})
  })
})
const PORT= process.env.PORT

server.listen(PORT, () => {
  console.log(`app is running in port ${PORT}`);
})

