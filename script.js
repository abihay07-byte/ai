// Paste your API key from Google AI Studio here:
const API_KEY = "AQ.Ab8RN6J-lzWEVViayJ1SrRZNulP6f05M27A7lGwQUsfLUR3RnA";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Add user message to chat box
  chatBox.innerHTML += `<p><strong>You:</strong> ${text}</p>`;
  userInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Show loading message
  const loadingElem = document.createElement("p");
  loadingElem.innerHTML = "<strong>Bot:</strong> Thinking...";
  chatBox.appendChild(loadingElem);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      loadingElem.innerHTML = `<strong>Bot Error:</strong> ${data.error.message}`;
    } else {
      const reply = data.candidates[0].content.parts[0].text;
      loadingElem.innerHTML = `<strong>Bot:</strong> ${reply}`;
    }
  } catch (err) {
    loadingElem.innerHTML = `<strong>Bot Error:</strong> Could not reach server.`;
  }
  
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Trigger on button click
sendBtn.addEventListener("click", sendMessage);

// Trigger on pressing "Enter" in the text box
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
