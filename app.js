const express = require('express')
const path = require('path')
const app = express()
const port = 2200
const publicPath = path.join(__dirname, 'public')
const server = app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})


const io = require('socket.io')(server)

app.use(express.static(publicPath))


let socketConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket){
    console.log('Socket connected', socket.id)
    socketConnected.add(socket.id)
    io.emit('clients-total', socketConnected.size)

    
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id)
        socketConnected.delete(socket.id)
        io.emit('clients-total', socketConnected.size)
    })
    

    socket.on('message', (data) => {
        // console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}