async function generateResponse(userMessage) {
  // 1. Paste your key directly inside the quotes below
  const API_KEY = "AQ.Ab8RN6J-lzWEVViayJ1SrRZNulP6f05M27A7lGwQUsfLUR3RnA"; 

  // 2. Clean URL without the ?key= parameter
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY // <--- Sends the key securely in header
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userMessage }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return `Error: ${data.error ? data.error.message : "Failed to fetch"}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(error);
    return "Error connecting to server.";
  }
}
