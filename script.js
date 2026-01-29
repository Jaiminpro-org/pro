// 🔥 IMPORTS
import { app } from "./firebase.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

console.log("JS loaded");

// 🔐 AUTH
const auth = getAuth(app);

// 🗄️ DATABASE
const db = getDatabase(app);
const messagesRef = ref(db, "messages");
const usersRef = ref(db, "users");

// 🎯 ELEMENTS
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");

let currentUser = null;
let username = localStorage.getItem("username");

// 🔐 SIGN IN ANONYMOUSLY
signInAnonymously(auth).catch((error) => {
  console.error("Auth error:", error);
});

// 👤 AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;

    // Ask username once
    if (!username) {
      username = prompt("Enter your name:");
      localStorage.setItem("username", username);
    }

    // Save user
    const userRef = ref(db, "users/" + user.uid);
    set(userRef, {
      name: username,
      online: true
    });

    // Remove on disconnect
    onDisconnect(userRef).update({
      online: false
    });
  }
});

// 📤 SEND MESSAGE
function sendMessage() {
  const text = input.value.trim();
  if (!text || !currentUser) return;

  push(messagesRef, {
    uid: currentUser.uid,
    name: username,
    text: text,
    time: Date.now()
  });

  input.value = "";
}

// EVENTS
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// 🧹 CLEAR CHAT (UI ONLY)
clearBtn.addEventListener("click", () => {
  chat.innerHTML = "";
});

// 🔁 CHANGE NAME
changeNameBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  location.reload();
});

// 💬 REALTIME MESSAGES
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();

  const msg = document.createElement("div");
  msg.classList.add(
    "message",
    data.uid === currentUser?.uid ? "me" : "other"
  );

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
