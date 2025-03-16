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
    // New API URL and options
    const url = 'https://chatgpt4-ai-chatbot.p.rapidapi.com/ask';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'e06cdfd3d6msh2d7b35a0e087920p11a9e8jsnf54c894f8f01',
        'x-rapidapi-host': 'chatgpt4-ai-chatbot.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: input
      })
    };

    // Call the new API
    const response = await fetch(url, options);
    const result = await response.json();  // Parse the JSON response

    // Extract just the response text
    const markdownText = result.response || "No response received.";

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
