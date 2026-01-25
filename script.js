import { app } from "./firebase.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue,
  onDisconnect,
  update
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

console.log("🔥 PRO Messenger Loaded");

// ======================
// 👤 USERNAME
// ======================
let username = localStorage.getItem("username");
if (!username) {
  username = prompt("Enter your name:");
  localStorage.setItem("username", username);
}

// ======================
// 🔐 PRIVATE CHAT ID
// ======================
function getChatId(u1, u2) {
  return [u1, u2].sort().join("_");
}

const partner = prompt("Chat with who?");
const chatId = getChatId(username, partner);

// ======================
// 🔥 DATABASE
// ======================
const db = getDatabase(app);
const messagesRef = ref(db, `chats/${chatId}/messages`);
const typingRef = ref(db, `chats/${chatId}/typing`);
const onlineRef = ref(db, `onlineUsers/${username}`);

// ======================
// 🟢 ONLINE STATUS
// ======================
set(onlineRef, true);
onDisconnect(onlineRef).remove();

// ======================
// 🎯 ELEMENTS
// ======================
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");
const emojiBtn = document.getElementById("emojiBtn");
const typingStatus = document.getElementById("typingStatus");
const onlineUsersDiv = document.getElementById("onlineUsers");
const themeBtn = document.getElementById("themeBtn");

// ======================
// 🔊 SOUND
// ======================
const sendSound = new Audio("send.mp3");
sendSound.volume = 0.6;

// ======================
// 😀 EMOJI
// ======================
const emojis = ["😀","😂","😍","😎","🔥","💙","👍","🥲","😜","❤️"];
emojiBtn.addEventListener("click", () => {
  input.value += emojis[Math.floor(Math.random() * emojis.length)];
  input.focus();
});

// ======================
// 🌙 DARK MODE
// ======================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.innerText = "☀️ Light";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.innerText = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ======================
// ✉️ SEND MESSAGE
// ======================
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  const msgRef = push(messagesRef);
  set(msgRef, {
    name: username,
    text,
    time: Date.now(),
    status: "sent"
  });

  sendSound.currentTime = 0;
  sendSound.play();

  input.value = "";
  set(typingRef, "");
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// ======================
// ✍️ TYPING INDICATOR
// ======================
let typingTimeout;
input.addEventListener("input", () => {
  set(typingRef, username);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => set(typingRef, ""), 1500);
});

onValue(typingRef, snap => {
  const name = snap.val();
  typingStatus.innerText =
    name && name !== username ? `${name} is typing...` : "";
});

// ======================
// 💬 REALTIME MESSAGES
// ======================
onChildAdded(messagesRef, snapshot => {
  const data = snapshot.val();
  const msgKey = snapshot.key;

  const msg = document.createElement("div");
  msg.className = `message ${data.name === username ? "me" : "other"}`;

  msg.innerHTML = `
    <div class="username">${data.name}</div>
    <div>${data.text}</div>
    <div class="time">
      ${new Date(data.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
      ${data.name === username ? (data.status === "seen" ? " ✔✔" : " ✔") : ""}
    </div>
  `;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  // 👁️ MARK SEEN
  if (data.name !== username) {
    update(ref(db, `chats/${chatId}/messages/${msgKey}`), {
      status: "seen"
    });
  }
});

// ======================
// 🟢 ONLINE USERS COUNT
// ======================
onValue(ref(db, "onlineUsers"), snap => {
  const users = snap.val() || {};
  onlineUsersDiv.innerText = `🟢 Online: ${Object.keys(users).length}`;
});

// ======================
// 🧹 UTILITIES
// ======================
clearBtn.addEventListener("click", () => chat.innerHTML = "");
changeNameBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  location.reload();
});
