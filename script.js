const API_KEY = "AQ.Ab8RN6ILaEq7tQKMkN-55JgirtdETx6pBf6QgefTh0m_hauyuQ";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function fetchAIResponse(userPrompt) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('bot');
    loadingDiv.textContent = "Thinking...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userPrompt }]
                }]
            })
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv);

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            appendMessage(aiReply, 'bot');
        } else if (data.error) {
            // Displays exact API error message (e.g. invalid key or quota exceeded)
            appendMessage(`Error: ${data.error.message}`, 'bot');
        } else {
            appendMessage("Sorry, I couldn't process that response.", 'bot');
        }
    } catch (error) {
        chatBox.removeChild(loadingDiv);
        appendMessage("Error: Could not connect to the network.", 'bot');
        console.error(error);
    }
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    appendMessage(text, 'user');
    userInput.value = '';
    fetchAIResponse(text);
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(className);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
