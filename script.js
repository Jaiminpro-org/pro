function send() {
  const text = document.getElementById("text");
  if (text.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.className = "msg me";
  msg.innerText = text.value;

  document.getElementById("messages").appendChild(msg);
  text.value = "";
}
