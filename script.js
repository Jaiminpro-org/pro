import { app } from "./firebase.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

console.log("JS loaded");

// 🔥 Database
const db = getDatabase(app);
const messagesRef = ref(db, `chats/${chatId}/messages`);

const typingRef = ref(db, "typing");

// 👤 Username
let username = localStorage.getItem("username");
if (!username) {
  username = prompt("Enter your name:");
  localStorage.setItem("username", username);
}
function getChatId(user1, user2) {
  return [user1, user2].sort().join("_");
}
let partner = prompt("Chat with who?");
const chatId = getChatId(username, partner);


// 🟢 Online presence
const onlineRef = ref(db, "onlineUsers/" + username);
set(onlineRef, true);
onDisconnect(onlineRef).remove();

// 🎯 Elements
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");
const emojiBtn = document.getElementById("emojiBtn");
const typingStatus = document.getElementById("typingStatus");
const onlineUsersDiv = document.getElementById("onlineUsers");
const themeBtn = document.getElementById("themeBtn");

// 🔊 Sound
const sendSound = new Audio("send.mp3");
sendSound.volume = 0.6;

// 😀 Emoji
const emojis = ["😀","😂","😍","😎","🔥","💙","👍","🥲","😜","❤️"];
emojiBtn.addEventListener("click", () => {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  input.value += emoji;
  input.focus();
});

// 🌙 Dark mode
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeBtn.innerText = "☀️ Light";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.innerText = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ✉️ Send message
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

 push(messagesRef, {
  name: username,
  text: text,
  time: Date.now(),
  status: "sent"
});


  sendSound.currentTime = 0;
  sendSound.play();

  input.value = "";
  set(typingRef, "");
}

// Buttons
button.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ✍️ Typing indicator
let typingTimeout;
input.addEventListener("input", () => {
  set(typingRef, username);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    set(typingRef, "");
  }, 1500);
});

// 🧹 Clear chat (UI only)
clearBtn.addEventListener("click", () => {
  chat.innerHTML = "";
});

// 🔁 Change name
changeNameBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  location.reload();
});

// 💬 Realtime messages
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();

  const msg = document.createElement("div");
  msg.classList.add("message", data.name === username ? "me" : "other");

  const name = document.createElement("div");
  name.className = "username";
  name.innerText = data.name;

  const text = document.createElement("div");
  text.innerText = data.text;
const time = document.createElement("div");
time.className = "time";

let ticks = "";
if (data.name === username) {
  ticks = data.status === "seen" ? " ✔✔" : " ✔";
}

time.innerText =
  new Date(data.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  }) + ticks;


  msg.appendChild(name);
  msg.appendChild(text);
  msg.appendChild(time);

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  // Mark message as SEEN if it is not mine
if (data.name !== username) {
  const msgRef = ref(db, "messages/" + snapshot.key);
  set(ref(db, `messages/${snapshot.key}/status`), "seen");
}

});

// 🟢 Online users count
const onlineUsersRef = ref(db, "onlineUsers");
onValue(onlineUsersRef, (snapshot) => {
  const users = snapshot.val() || {};
  onlineUsersDiv.innerText = `🟢 Online: ${Object.keys(users).length}`;
});

// ⌨️ Typing listener
onValue(typingRef, (snapshot) => {
  const name = snapshot.val();
  typingStatus.innerText =
    name && name !== username ? `${name} is typing...` : "";
});
