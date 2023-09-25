const express = require("express");
const app = express();

app.use(express.static("public"));

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);
const users = {};

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("chatMsg", `Se conectó el usuario: ${username}`);
    console.log(users);
  });

  socket.on("chatMsg", (msg) => {
    if (msg === "/listar") {
      io.emit(
        "chatMsg",
        `Usuarios conectados: ${Object.values(users).join("   |   ")}`
      );
      console.log(users);
      return;
    }
    io.emit("chatMsg", msg);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
    const username = users[socket.id];
    if (username) {
      io.emit("chatMsg", `Se desconectó el usuario: ${username}`);
      delete users[socket.id];
    }
  });
  socket.on("reconnect", () => {
    console.log("usuario reconectado", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Error en la conexión", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("Usuario reconectado:", socket.id, "Intento:", attemptNumber);
  });
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/login.html`);
});

app.get("/chat", (req, res) => {
  res.sendFile(`${__dirname}/public/chat.html`);
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
