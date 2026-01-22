// 🔥 Firebase config (PASTE YOUR REAL VALUES)
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  databaseURL: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Database
const db = firebase.database();
const messagesRef = db.ref("messages");

console.log("JS loaded");

// Elements
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");

// Username
let username = localStorage.getItem("username");
if (!username) {
  username = prompt("Enter your name:");
  localStorage.setItem("username", username);
}

// ✅ SEND MESSAGE (ONLY PUSH TO FIREBASE)
function sendMessage(e) {
  if (e) e.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  messagesRef.push({
    name: username,
    text: text,
    time: Date.now()
  });

  input.value = "";
}

// Button click
button.addEventListener("click", sendMessage);

// Enter key
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage(e);
  }
});

// Clear chat (local only)
clearBtn.addEventListener("click", function () {
  chat.innerHTML = "";
});

// Change name
changeNameBtn.addEventListener("click", function () {
  localStorage.removeItem("username");
  location.reload();
});

// ✅ REALTIME LISTENER (UI IS BUILT HERE ONLY)
messagesRef.on("child_added", function (snapshot) {
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
