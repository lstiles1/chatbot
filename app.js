async function sendMessage() {
  const input = document.getElementById("userInput").value;
  const chatContainer = document.getElementById("chat_container");
  
  if (!input) return;

  // Display user's message
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = `You: ${input}`;
  chatContainer.appendChild(userMessage);

  // Display loading message (Bot message "Loading...")
  const loadingMessage = document.createElement("div");
  loadingMessage.className = "message bot-message bot-loading";
  loadingMessage.textContent = "Bot: Loading...";
  chatContainer.appendChild(loadingMessage);

  // Scroll to the latest message
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    // Call the API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer CLIENT_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-3-1b-it:free",
        "messages": [{ "role": "user", "content": input }]
      })
    });

    // Handle the response
    const data = await response.json();
    const markdownText = data.choices?.[0]?.message?.content || "No response received.";

    // Remove the loading message
    chatContainer.removeChild(loadingMessage);

    // Create the bot's message with typing effect
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    chatContainer.appendChild(botMessage);

    let index = 0;
    const typingInterval = setInterval(() => {
      botMessage.innerHTML += markdownText.charAt(index);
      index++;
      if (index === markdownText.length) {
        clearInterval(typingInterval);
      }
    }, 5);  // Adjust the typing speed (milliseconds per character)

  } catch (error) {
    // Remove the loading message and show error message
    chatContainer.removeChild(loadingMessage);
    const errorMessage = document.createElement("div");
    errorMessage.className = "message error-message";
    errorMessage.textContent = `Error: ${error.message}`;
    chatContainer.appendChild(errorMessage);
  } finally {
    // Reset the input field after sending the message
    document.getElementById("userInput").value = '';
  }

  // Scroll to the latest message
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
