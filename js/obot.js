const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");

const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");

const headerProfile = document.getElementById("headerProfile");
const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");

const homeScreen = document.getElementById("homeScreen");
const chatScreen = document.getElementById("chatScreen");

const messageBtn = document.getElementById("messageBtn");
const homeBtn = document.getElementById("homeBtn");

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");

const blueBox = document.getElementById("blueBox");
const headinf = document.getElementById("ui-co");


/* OPEN CHAT */
chatToggle.addEventListener("click", () => {
  chatBox.classList.add("open");
});

/* CLOSE CHAT */
closeChat.addEventListener("click", () => {
  chatBox.classList.remove("open");
});


/* OPEN MESSAGE SCREEN */
messageBtn.addEventListener("click", () => {

  homeScreen.style.display = "none";
  chatScreen.style.display = "flex";
  blueBox.style.display = "none";

  headinf.style.color = "#0a1f44";
  headerProfile.style.display = "flex";

});


/* GO BACK HOME */
homeBtn.addEventListener("click", () => {

  chatScreen.style.display = "none";
  homeScreen.style.display = "block";
  blueBox.style.display = "block";

  headinf.style.color = "#f9f9f9";
  headerProfile.style.display = "none";

});


/* SEND BUTTON */
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});


/* ENTER / SHIFT ENTER */
input.addEventListener("keydown", (e) => {

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }

});


function sendMessage() {

  const text = input.value.trim();
  if (text === "") return;

  const message = document.createElement("div");
  message.classList.add("message", "user");

  message.innerHTML = `
    <div class="bubble">${text}</div>
    <span class="time">${getTime()}</span>
  `;

  chatMessages.appendChild(message);

  input.value = "";

  chatMessages.scrollTop = chatMessages.scrollHeight;

  botReply(text);

}


/* EMOJI PICKER */

emojiBtn.addEventListener("click", () => {

  emojiPicker.style.display =
    emojiPicker.style.display === "block"
      ? "none"
      : "block";

});


emojiPicker.addEventListener("click", (e) => {

  if (!e.target.textContent.trim()) return;

  input.value += e.target.textContent;

  emojiPicker.style.display = "none";

});


/* FILE UPLOAD */

fileBtn.addEventListener("click", () => {
  fileInput.click();
});


fileInput.addEventListener("change", () => {

  const file = fileInput.files[0];
  if (!file) return;

  const msg = document.createElement("div");
  msg.classList.add("message", "user");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  bubble.innerText = "📎 " + file.name;

  msg.appendChild(bubble);

  chatMessages.appendChild(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;

});


/* BOT REPLY */

async function botReply(userMessage){

  const typing = document.createElement("div");

  typing.classList.add("message","bot");

  typing.innerHTML = `
    <div class="typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;

  chatMessages.appendChild(typing);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  try{

    const res = await fetch("https://bot-production-ccdf.up.railway.app/api/chat",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body: JSON.stringify({
        message:userMessage
      })

    });

    const data = await res.json();

    typing.remove();

    const reply = document.createElement("div");

    reply.classList.add("message","bot");

    reply.innerHTML = `
      <div class="bubble">${data.reply}</div>
      <span class="time">${getTime()}</span>
    `;

    chatMessages.appendChild(reply);

    chatMessages.scrollTop = chatMessages.scrollHeight;

  }catch(err){

    typing.remove();

    const reply = document.createElement("div");

    reply.classList.add("message","bot");

    reply.innerHTML = `
      <div class="bubble">Server error</div>
    `;

    chatMessages.appendChild(reply);

  }

}

/* TIME FUNCTION */

function getTime() {

  const now = new Date();

  return (
    now.getHours() +
    ":" +
    now.getMinutes().toString().padStart(2, "0")
  );

}