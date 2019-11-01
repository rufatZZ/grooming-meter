const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");

const { Users } = require("./Users");

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

io.on("connection", socket => {
  socket.on("join", params => {
    const { session, username } = params;
    const newUser = { id: socket.id, username, session };

    socket.join(session);
    users.add(newUser);
    io.to(params.session).emit("updateUsers", users.getList());
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
