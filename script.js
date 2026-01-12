function send() {
  const text = document.getElementById("text");
  if (text.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.className = "msg me";
  msg.innerText = text.value;

  document.getElementById("messages").appendChild(msg);
  text.value = "";
}
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const chat = document.getElementById("chat");

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerText = text;

  chat.appendChild(msg);

  // clear input
  input.value = "";

  // auto scroll
  chat.scrollTop = chat.scrollHeight;
}

// click send button
button.addEventListener("click", sendMessage);

// press Enter key
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
