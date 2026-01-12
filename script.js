const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");

button.addEventListener("click", sendMessage);
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});


function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  const msg = document.createElement("div");
  msg.className = "message me";

  msg.innerText = text;

  chat.appendChild(msg);
  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}

.message {
  max-width: 70%;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 8px;
  word-wrap: break-word;
}

.me {
  background: #0084ff;
  color: white;
  margin-left: auto;
  text-align: right;
}

.other {
  background: #e4e6eb;
  color: black;
  margin-right: auto;
  text-align: left;
}
