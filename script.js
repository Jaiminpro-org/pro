const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");

button.addEventListener("click", sendMessage);

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerText = text;

  chat.appendChild(msg);
  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}
