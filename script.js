import { auth, provider } from "./firebase.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
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

/* ---------- BASIC SETUP ---------- */
const db = getDatabase(app);
const messagesRef = ref(db, "messages");
const typingRef = ref(db, "typing");
const onlineUsersRef = ref(db, "onlineUsers");

/* ---------- ELEMENTS ---------- */
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");
const emojiBtn = document.getElementById("emojiBtn");
const typingStatus = document.getElementById("typingStatus");
const onlineUsersDiv = document.getElementById("onlineUsers");
const themeBtn = document.getElementById("themeBtn");

const sendSound = new Audio("send.mp3");
sendSound.volume = 0.6;

/* ---------- USERNAME ---------- */
let username = localStorage.getItem("username");

if (!username) {
  username = prompt("Enter your name");
  localStorage.setItem("username", username);
}

const myOnlineRef = ref(db, "onlineUsers/" + username);
set(myOnlineRef, true);
onDisconnect(myOnlineRef).remove();
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.onclick = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    alert(err.message);
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};


/* ---------- SEND MESSAGE ---------- */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  push(messagesRef, {
    name: username,
    text,
    time: Date.now()
  });

  sendSound.currentTime = 0;
  sendSound.play();

  input.value = "";
  set(typingRef, "");
}

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

/* ---------- TYPING STATUS ---------- */
let typingTimer;
input.addEventListener("input", () => {
  set(typingRef, username);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => set(typingRef, ""), 1500);
});

/* ---------- EMOJI ---------- */
const emojis = ["😀","😂","😍","😎","🔥","💙","👍","🥲","😜","❤️"];
emojiBtn.onclick = () => {
  input.value += emojis[Math.floor(Math.random() * emojis.length)];
  input.focus();
};

/* ---------- CHAT LISTENER ---------- */
onChildAdded(messagesRef, snap => {
  const data = snap.val();

  const msg = document.createElement("div");
  msg.className = "message " + (data.name === username ? "me" : "other");

  msg.innerHTML = `
    <div class="username">${data.name}</div>
    <div>${data.text}</div>
    <div class="time">${new Date(data.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })}</div>
  `;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
});

/* ---------- TYPING LISTENER ---------- */
onValue(typingRef, snap => {
  const name = snap.val();
  typingStatus.innerText =
    name && name !== username ? `${name} is typing...` : "";
});

/* ---------- ONLINE USERS ---------- */
onValue(onlineUsersRef, snap => {
  const users = snap.val() || {};
  onlineUsersDiv.innerText = `🟢 Online: ${Object.keys(users).length}`;
});

/* ---------- UI ACTIONS ---------- */
clearBtn.onclick = () => chat.innerHTML = "";

changeNameBtn.onclick = () => {
  localStorage.removeItem("username");
  location.reload();
};

/* ---------- DARK MODE ---------- */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeBtn.innerText = "☀️ Light";
}

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeBtn.innerText = dark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", dark ? "dark" : "light");
};
onAuthStateChanged(auth, user => {
  if (user) {
    username = user.displayName;
    localStorage.setItem("username", username);

    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    const myOnlineRef = ref(db, "onlineUsers/" + username);
    set(myOnlineRef, true);
    onDisconnect(myOnlineRef).remove();
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    chat.innerHTML = "";
  }
});
