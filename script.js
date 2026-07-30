// 1. Put your raw Google AI Studio API Key inside the quotes below (starts with AIzaSy...)
const API_KEY = "QVEuQWI4Uk42TDZVNHpOd1BURFVqOU5Td2sxMWpMNDVtSVFxUS13S2NoY2RoNlFHV0IyZlE=";

// 2. Select HTML elements
const chatInput = document.querySelector("#chat-input") || document.querySelector("input");
const sendBtn = document.querySelector("#send-btn") || document.querySelector("button");
const chatBox = document.querySelector("#chat-box") || document.querySelector(".chat-container") || document.body;

// 3. Function to send message to Gemini API
async function generateResponse(userMessage) {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userMessage }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error Response:", data);
      return `Error: ${data.error ? data.error.message : "Failed to fetch response"}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Error connecting to server. Please check your connection.";
  }
}

// 4. Handle Send Button Click
if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    // Display user message
    const userMsgElem = document.createElement("p");
    userMsgElem.textContent = "You: " + message;
    chatBox.appendChild(userMsgElem);
    chatInput.value = "";

    // Display bot response
    const botMsgElem = document.createElement("p");
    botMsgElem.textContent = "Bot is typing...";
    chatBox.appendChild(botMsgElem);

    const botResponse = await generateResponse(message);
    botMsgElem.textContent = "Bot: " + botResponse;
  });
}
