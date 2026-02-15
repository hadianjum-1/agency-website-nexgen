const toggleBtn = document.getElementById("chat-toggle");
const chatWidget = document.getElementById("chat-widget");
const closeBtn = document.getElementById("close-chat");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

toggleBtn.onclick = () => {
  chatWidget.style.display = "flex";
};

closeBtn.onclick = () => {
  chatWidget.style.display = "none";
};

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.innerText = text;
  chatBox.appendChild(userDiv);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  const aiDiv = document.createElement("div");
  aiDiv.className = "ai-msg";
  aiDiv.innerText = "Typing...";
  chatBox.appendChild(aiDiv);

  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });

  const data = await res.json();
  aiDiv.innerText = data.reply;
  chatBox.scrollTop = chatBox.scrollHeight;
}
