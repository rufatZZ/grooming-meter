const express  = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
app.use(express.static(publicPath));

let io = new socketIO();

io.on('connection', (socket) => {

    socket.on('join', (params) => {
        socket.join(params.user);
    });

    socket.on('leave', (params) => {
        socket.leave(params.user);
    });

});

server.listen(PORT, () => console.log(`Server ${PORT} on fly`));
