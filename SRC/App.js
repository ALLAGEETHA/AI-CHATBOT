import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    setInput("");

    try {
      const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
        sender: "user",
        message: input,
      });

      const botMessages = response.data.map((res) => ({
        sender: "bot",
        text: res.text,
      }));

      setMessages([...messages, userMessage, ...botMessages]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...messages, userMessage, { sender: "bot", text: "Error connecting to chatbot." }]);
    }
  };
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };


  return (
    <div className="chat-container">
      <header className="header">
        <h1>ShopTalk - AI Chatbot</h1>
      </header>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
            {msg.sender === "bot" && (
              <button className="voice-btn" onClick={() => speakText(msg.text)}>🔊</button>
            )}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type a message or use the mic ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="mic-btn" onClick={startListening}>
          🎙️
        </button>

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
