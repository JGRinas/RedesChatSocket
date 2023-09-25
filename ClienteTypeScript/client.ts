import { io, Socket } from "socket.io-client";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Introduce la dirección IP del host: ", (host) => {
  rl.question("Introduce el puerto del servidor: ", (port) => {
    rl.question("Introduce tu nombre de usuario: ", (username) => {
      const socket: Socket = io(`http://${host}:${port}`);

      socket.on("connect", () => {
        console.log("¡Conexión exitosa!");
        socket.emit("join", username);

        rl.on("line", (input) => {
          const message: string = input.trim();
          if (message.toLowerCase() === "/quitar") {
            socket.disconnect();
            rl.close();
          } else {
            socket.emit("chatMsg",`${username}: ${message}`);
          }
        });

        socket.on("chatMsg", (msg: string) => {
          console.log(msg);
        });
      });

      socket.on("connect_error", () => {
        console.log("Error al conectar al servidor");
        rl.close();
      });
    });
  });
});
