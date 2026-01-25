import { app } from "./firebase.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue,
  onDisconnect,
  remove
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

console.log("JS loaded");

// Database
const db = getDatabase(app);
const messagesRef = ref(db, "messages");
const typingRef = ref(db, "typing");
const onlineRef = ref(db, "onlineUsers/" + username);


// Elements
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");
const emojiBtn = document.getElementById("emojiBtn");
const typingStatus = document.getElementById("typingStatus");
const sendSound = new Audio("send.mp3");
sendSound.volume = 0.6;
const themeBtn = document.getElementById("themeBtn");


// Emoji
const emojis = ["😀","😂","😍","😎","🔥","💙","👍","🥲","😜","❤️"];
emojiBtn.addEventListener("click", () => {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  input.value += emoji;
  input.focus();
});

// Username
let username = localStorage.getItem("username");
if (!username) {
  username = prompt("Enter your name:");
  localStorage.setItem("username", username);
  set(onlineRef, true);

// Remove user when disconnected
onDisconnect(onlineRef).remove();

}

// ✅ SEND MESSAGE
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  push(messagesRef, {
    name: username,
    text: text,
    time: Date.now()
  });

   sendSound.currentTime = 0; // reset sound
  sendSound.play();         // 🔔 PLAY SOUND

  input.value = "";
  set(typingRef, "");

}

// Button
button.addEventListener("click", sendMessage);

// Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ✅ TYPING INDICATOR
let typingTimeout;

input.addEventListener("input", () => {
  set(typingRef, username);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    set(typingRef, "");
  }, 1500);
});

// Clear chat (UI only)
clearBtn.addEventListener("click", () => {
  chat.innerHTML = "";
});

// Change name
changeNameBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  location.reload();
});

// ✅ REALTIME MESSAGES
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
  time.innerText = new Date(data.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  msg.appendChild(name);
  msg.appendChild(text);
  msg.appendChild(time);

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
});

// ✅ LISTEN FOR TYPING
onValue(typingRef, (snapshot) => {
  const name = snapshot.val();
  typingStatus.innerText =
    name && name !== username ? `${name} is typing...` : "";
});
// 🌙 Dark mode toggle
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
const onlineUsersDiv = document.getElementById("onlineUsers");

const onlineUsersRef = ref(db, "onlineUsers");

onValue(onlineUsersRef, (snapshot) => {
  const users = snapshot.val() || {};
  const count = Object.keys(users).length;
  onlineUsersDiv.innerText = `🟢 Online: ${count}`;
});
