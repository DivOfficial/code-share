const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { Socket } = require("socket.io-client");
const ACTIONS = require("./src/Action");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (Socket) => {
  console.log("socketConnecte", Socket.id);

  Socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[Socket.id] = username;
    Socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    //   console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: Socket.id,
      });
    });
  });

  Socket.on(ACTIONS.CODE_CHANGE,({roomId, code})=>{
    Socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
  })

    Socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });


  Socket.on("disconnecting", () => {
    const rooms = [...Socket.rooms];
    rooms.forEach((roomId) => {
      Socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: Socket.id,
        username: userSocketMap[Socket.id],
      });
    });
    delete userSocketMap[Socket.id];
    Socket.leave();
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`server UP on ${PORT}`));
