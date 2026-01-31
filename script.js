import { app } from "./firebase.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const authScreen = document.getElementById("authScreen");
const chatApp = document.getElementById("chatApp");
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");
const onlineUsersDiv = document.getElementById("onlineUsers");
const typingStatus = document.getElementById("typingStatus");
const themeBtn = document.getElementById("themeBtn");
const backBtn = document.getElementById("backBtn");
const chatTitle = document.getElementById("chatTitle");

let currentUser;
let mode = "public";
let privateChatId = null;

const emojis = ["😀","😂","😍","🔥","😎","❤️"];

document.getElementById("googleLogin").onclick = () => {
  signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, user => {
  if (!user) return;
  currentUser = user;
  authScreen.classList.add("hidden");
  chatApp.classList.remove("hidden");

  const userRef = ref(db, "onlineUsers/" + user.uid);
  set(userRef, user.displayName);
  onDisconnect(userRef).remove();

  loadPublicChat();
  loadOnlineUsers();
});

function loadPublicChat() {
  chat.innerHTML = "";
  mode = "public";
  chatTitle.innerText = "Public Chat";
  backBtn.classList.add("hidden");

  const messagesRef = ref(db, "messages");
  onChildAdded(messagesRef, snap => render(snap.val()));
}

function openPrivate(uid, name) {
  chat.innerHTML = "";
  mode = "private";
  backBtn.classList.remove("hidden");
  chatTitle.innerText = "Chat with " + name;

  privateChatId =
    currentUser.uid < uid
      ? currentUser.uid + "_" + uid
      : uid + "_" + currentUser.uid;

  const privateRef = ref(db, "privateChats/" + privateChatId);
  onChildAdded(privateRef, snap => render(snap.val()));
}

function render(data) {
  const div = document.createElement("div");
  div.className =
    "message " + (data.uid === currentUser.uid ? "me" : "other");
  div.innerHTML = `<div class="username">${data.name}</div>${data.text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

sendBtn.onclick = sendMessage;
input.onkeydown = e => e.key === "Enter" && sendMessage();

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  const data = {
    name: currentUser.displayName,
    uid: currentUser.uid,
    text,
    time: Date.now()
  };

  if (mode === "public") {
    push(ref(db, "messages"), data);
  } else {
    push(ref(db, "privateChats/" + privateChatId), data);
  }

  input.value = "";
}

emojiBtn.onclick = () => {
  input.value += emojis[Math.floor(Math.random()*emojis.length)];
};

function loadOnlineUsers() {
  onValue(ref(db, "onlineUsers"), snap => {
    onlineUsersDiv.innerHTML = "🟢 Online Users";
    Object.entries(snap.val() || {}).forEach(([uid,name]) => {
      if (uid === currentUser.uid) return;
      const b = document.createElement("button");
      b.innerText = name;
      b.onclick = () => openPrivate(uid,name);
      onlineUsersDiv.appendChild(b);
    });
  });
}

backBtn.onclick = loadPublicChat;

themeBtn.onclick = () => document.body.classList.toggle("dark");
