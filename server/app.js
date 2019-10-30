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

server.listen(PORT, () => console.log(`Server ${PORT} on fly`));
