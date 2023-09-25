let socket = io({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999,
});

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("username")) {
    window.location.href = "/";
  }
  inputChat.focus();
  socket.emit("join", localStorage.getItem("username"));
  console.log(localStorage.getItem("username"));
});

const formChat = document.getElementById("formChat");
const inputChat = document.getElementById("inputChat");
const mensajes = document.getElementById("ulChat");

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputChat.value) {
    if (inputChat.value === "/quitar") {
      socket.disconnect(true);
      localStorage.removeItem("username");
      window.location.href = "/";
      return;
    }

    if (inputChat.value === "/listar") {
      socket.emit("chatMsg", "/listar");
      inputChat.value = "";
      inputChat.focus();
      return;
    }

    const username = localStorage.getItem("username") || "Anónimo";
    socket.emit("chatMsg", `${username}: ${inputChat.value}`);
    inputChat.value = "";
    inputChat.focus();
  }
});

socket.on("chatMsg", (msg) => {
  let item = document.createElement("li");
  item.textContent = msg;
  mensajes.appendChild(item);
  window.scrollto(0, document.body.scrollHeight);
});
