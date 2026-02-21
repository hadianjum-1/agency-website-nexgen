const toggleBtn = document.getElementById("chat-toggle");
const chatWidget = document.getElementById("chat-widget");
const closeBtn = document.getElementById("close-chat");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

/* =========================
   SESSION ID (IMPORTANT)
========================= */
let sessionId = localStorage.getItem("chat_session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("chat_session_id", sessionId);
}

/* =========================
   LEAD CACHE
========================= */
const leadData = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

toggleBtn.onclick = () => {
  chatWidget.style.display = "flex";
};

closeBtn.onclick = () => {
  chatWidget.style.display = "none";
};

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // stop new line
    sendMessage();
  }
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="user-msg">${text}</div>`;
  input.value = "";
  const BotICon = document.createElement('div');
 
BotICon.classList.add('bot-pic');

const img = document.createElement("img");
img.src = "./img/cute-smiling-robot-face-glowing-600nw-2657821003.webp";
img.alt = "Bot";

BotICon.appendChild(img);

const aiDiv = document.createElement("div");
aiDiv.className = "ai-msg";
aiDiv.innerText = "Typing...";

chatBox.appendChild(BotICon);
chatBox.appendChild(aiDiv);
 
  aiDiv.className = "ai-msg";
  aiDiv.innerText = "Typing...";
  chatBox.appendChild(aiDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  const res = await fetch(" https://bot-production-0b6a.up.railway.app/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      sessionId: sessionId
    }),
  });

  const data = await res.json();
  aiDiv.innerText = data.reply;
  chatBox.scrollTop = chatBox.scrollHeight;

  /* =========================
     AUTO CAPTURE USER INFO
  ========================= */
  if (!leadData.email && text.includes("@")) {
    leadData.email = text;
  } else if (!leadData.phone && /\d{7,}/.test(text)) {
    leadData.phone = text;
  } else if (!leadData.name) {
    leadData.name = text;
  } else if (!leadData.service) {
    leadData.service = text;
  } else if (!leadData.message) {
    leadData.message = text;
  }

  /* =========================
     SEND LEAD ONLY ONCE
  ========================= */
  if (data.done === true && !localStorage.getItem("lead_sent")) {
    await fetch("https://bot-production-0b6a.up.railway.app/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: leadData.name || "Website Visitor",
        email: leadData.email,
        phone: leadData.phone || "",
        service: leadData.service || "Not specified",
        message: leadData.message || "Interested via chatbot",
      }),
    });

    localStorage.setItem("lead_sent", "true");
  }
}


// https://bot-production-0b6a.up.railway.app/lead https://bot-production-0b6a.up.railway.app/chat
