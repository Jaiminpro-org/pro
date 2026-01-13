const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  const msg = document.createElement("div");
  msg.classList.add("message", "me");
  msg.innerText = text;

  chat.appendChild(msg);
  input.value = "";
  chat.scrollTop = chat.scrollHeight;
  setTimeout(fakeReply, 800);

}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
function fakeReply() {
  const replies = [
    "Hi 🙂",
    "Okay 👍",
    "Nice!",
    "Tell me more 👀",
    "Haha 😄"
  ];

  const msg = document.createElement("div");
  msg.classList.add("message", "other");
  msg.innerText = replies[Math.floor(Math.random() * replies.length)];

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}
