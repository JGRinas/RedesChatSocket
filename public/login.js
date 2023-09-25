const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  localStorage.setItem("username", username);
  window.location.href = "chat";
});
