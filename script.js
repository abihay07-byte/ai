// Paste your raw AQ key directly here (e.g., "AQ.Ab123...")
const API_KEY = "AQ.Ab8RN6LELuj53M0YMwp4lEdvQ3mK9gsPTP61fFM2IpMWem9vqA".trim();

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(`You: ${text}`, "user-message");
  userInput.value = "";

  const loadingElem = appendMessage("Bot: Thinking...", "bot-message");

  // Endpoint setup
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY // Sends AQ key safely in HTTP Header
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      loadingElem.style.color = "red";
      loadingElem.innerText = `Error (${response.status}): ${data.error ? data.error.message : "Authentication Failed"}`;
      return;
    }

    const reply = data.candidates[0].content.parts[0].text;
    loadingElem.style.color = "black";
    loadingElem.innerText = `Bot: ${reply}`;

  } catch (err) {
    loadingElem.style.color = "red";
    loadingElem.innerText = `Network Error: ${err.message}`;
  }
}

function appendMessage(text, className) {
  const p = document.createElement("p");
  p.className = className;
  p.innerText = text;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
  return p;
}

sendBtn?.addEventListener("click", sendMessage);
userInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
