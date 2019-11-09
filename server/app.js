const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");

const { Users } = require("./Users");
const { Votes } = require("./Votes");

const publicPath = path.join(__dirname, "../public");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
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
const users = new Users();
const votes = new Votes();

io.on("connection", socket => {
  socket.on("join", params => {
    const { session, username } = params;
    const newUser = { id: socket.id, username, session };

    socket.join(session);
    users.add(newUser);
    io.to(session).emit("updateUsers", users.getList());
  });

  socket.on("vote", params => {
    const { session, vote } = params;
    const newVote = { id: socket.id, vote };
    socket.join(session);
    votes.addVote(newVote);
    io.to(session).emit("updateVotes", votes.getList());
  });

  socket.on("leave", () => {
    socket.leave(user.session);
  });

  socket.on("disconnect", () => {
    const user = users.remove(socket.id);

    if (user) {
      socket.broadcast.emit("updateUsers", users.getList());
      socket.disconnect(user.session);
    }
  });
});

server.listen(PORT, () => console.log(`Server ${PORT} on fly`));
