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

io.on('connection', (socket) => {

    socket.on('join', (params) => {
        socket.join(params.session);
    });

    socket.on('leave', (params) => {
        socket.leave(params.session);
    });

});

server.listen(PORT, () => console.log(`Server ${PORT} on fly`));
