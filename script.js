import { db, auth, provider } from "./firebase.js";
import {
  ref,
  push,
  onChildAdded,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import {
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Elements
const login = document.getElementById("login");
const app = document.getElementById("app");
const googleBtn = document.getElementById("googleLogin");
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const userName = document.getElementById("userName");
const onlineCount = document.getElementById("onlineCount");

const messagesRef = ref(db, "messages");
const onlineRef = ref(db, "online");

// LOGIN
googleBtn.onclick = () => {
  signInWithPopup(auth, provider).catch(err => alert(err.message));
};

// AUTH STATE
onAuthStateChanged(auth, user => {
  if (!user) return;

  login.classList.add("hidden");
  app.classList.remove("hidden");
  userName.textContent = user.displayName;

  set(ref(db, "online/" + user.uid), true);
});

// SEND
sendBtn.onclick = send;
input.addEventListener("keydown", e => e.key === "Enter" && send());

function send() {
  if (!input.value.trim()) return;
  push(messagesRef, {
    name: auth.currentUser.displayName,
    text: input.value,
    time: Date.now()
  });
  input.value = "";
}

// RECEIVE
onChildAdded(messagesRef, snap => {
  const d = snap.val();
  const div = document.createElement("div");
  div.className = "message " + (d.name === auth.currentUser.displayName ? "me" : "other");
  div.textContent = d.text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// ONLINE COUNT
onValue(onlineRef, snap => {
  onlineCount.textContent = "🟢 " + Object.keys(snap.val() || {}).length;
});
