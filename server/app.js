const express  = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

app.use(express.static(publicPath));


let io = new socketIO(server);
let users = [];

io.on('connection', (socket) => {

    socket.on('join', (params) => {
        console.log('user joined');
        socket.join(params.session);
        users.push(params.user);

        io.to(params.session).emit('updateUsers', users);
    });

    socket.on('leave', (params) => {
        console.log('user left');
        socket.leave(params.session);
    });

    socket.on('disconnect', (params) => {
        console.log('user disconnected');
        socket.disconnect(params.session);
    });

});

server.listen(PORT, () => console.log(`Server ${PORT} on fly`));
