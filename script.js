// Firebase config
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

// Database reference
const db = firebase.database();
const messagesRef = db.ref("messages");

console.log("JS loaded");


const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const changeNameBtn = document.getElementById("changeNameBtn");


let username = localStorage.getItem("username");

if (!username) {
  username = prompt("Enter your name:");
  localStorage.setItem("username", username);
}


function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  const msg = document.createElement("div");
  msg.classList.add("message", "me");
  const name = document.createElement("div");
name.className = "username";
name.innerText = username;

msg.appendChild(name);
msg.append(text);
const time = document.createElement("div");
time.className = "time";
time.innerText = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit"
});
msg.appendChild(time);

  chat.appendChild(msg);
  input.value = "";
  chat.scrollTop = chat.scrollHeight;
  setTimeout(fakeReply, 800);
messagesRef.push({
  name: username,
  text: text,
  time: Date.now()
});

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
clearBtn.addEventListener("click", function () {
  chat.innerHTML = "";
});
changeNameBtn.addEventListener("click", function () {
  localStorage.removeItem("username");
  location.reload();
});
messagesRef.on("child_added", function (snapshot) {
  const data = snapshot.val();

  const msg = document.createElement("div");
  msg.classList.add("message");

  msg.classList.add(data.name === username ? "me" : "other");

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

