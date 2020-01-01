const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const _ = require('lodash');

const { Users } = require('./Users');
const { Votes } = require('./Votes');
const { Timer } = require('./Timer');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.static(publicPath));

let io = new socketIO(server);
const users = new Users();
const votes = new Votes();

io.on('connection', socket => {
    const { session } = socket.handshake.query;

    socket.join(session);

    socket.on('join', params => {
        const { username } = params;
        const newUser = { id: socket.id, username, session, isVoted: false };

        users.add(newUser);

        io.to(session).emit('updateUsers', users.getList());
        io.to(session).emit('updateVotes', votes.getFormattedList());
        io.to(session).emit('toggleShow', votes.showVoteList);
    });

    socket.on('vote', params => {
        const { vote } = params;
        const newVote = { id: socket.id, vote };

        votes.addVote(newVote);
        users.userVoted(socket.id);

        io.to(session).emit('updateUsers', users.getList());
        io.to(session).emit('updateVotes', votes.getFormattedList());
    });

    socket.on('handleShow', params => {
        votes.setShowVoteList(params.isShowing);

        io.to(session).emit('toggleShow', votes.showVoteList);
    });

    socket.on('resetVotes', () => {
        votes.reset();
        users.userVoted();
        votes.setShowVoteList(false);

        io.to(session).emit('toggleShow', votes.showVoteList);
        io.to(session).emit('updateUsers', users.getList()); 
        io.to(session).emit('updateVotes', votes.getFormattedList());
    });

    socket.on('leave', () => {
        socket.leave(session);
    });

    socket.on('disconnect', () => {
        const user = users.getUser(socket.id);

        if (user) {
            users.remove(socket.id);
            votes.removeVote(socket.id);

            io.to(session).emit('updateUsers', users.getList());
            io.to(session).emit('updateVotes', votes.getFormattedList());

            socket.disconnect(user.session);
        }

        if(_.isEmpty(users.getList())){
            votes.reset();
            votes.setShowVoteList(false);
        }
    });
});

server.listen(PORT, () => console.log(`Server ${PORT} on fly`));
