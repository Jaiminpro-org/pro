const username = prompt("Enter your username") || "You";

const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const chat = document.getElementById("chat");

function addMessage(text, sender, type) {
  const msg = document.createElement("div");
  msg.className = "message " + type;

  const name = document.createElement("div");
  name.className = "username";
  name.innerText = sender;

  const content = document.createElement("div");
  content.innerText = text;

  msg.appendChild(name);
  msg.appendChild(content);
  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  addMessage(text, username, "me");
  input.value = "";

  // demo reply
  setTimeout(() => {
    addMessage("Got it 👍", "Friend", "other");
  }, 600);
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
