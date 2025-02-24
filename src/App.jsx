import React, { useState, useRef, useEffect } from "react";
import { X, MoreHorizontal, Bot, Send } from "lucide-react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/chats"; // Update with the correct backend URL if hosted remotely

const App = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! How can I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot response");
      }

      const data = await response.json();
      return data.response; // Extract bot's message from API response
    } catch (error) {
      console.error("Error getting bot response:", error);
      return "I'm sorry, I encountered an error. Could you try again?";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      text: inputMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    const botResponse = await getBotResponse(inputMessage);
    setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-left">
          <div className="bot-icon-container">
            <Bot className="bot-icon" />
          </div>
          <div>
            <h1 className="header-title">Cloud Nexus Bot</h1>
            <p className="header-status">Online Now</p>
          </div>
        </div>
       
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.type === "user" ? "user-message-wrapper" : ""}`}>
            {message.type === "bot" && (
              <div className="bot-message-container">
                <div className="bot-avatar">
                  <Bot className="bot-message-icon" />
                </div>
                <div className="bot-message-content">
                  <p className="bot-name">Bot</p>
                  <div className="bot-message">
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            )}
            {message.type === "user" && (
              <div className="user-message">
                <p>{message.text}</p>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bot-message-container">
            <div className="bot-avatar">
              <Bot className="bot-message-icon" />
            </div>
            <div className="loading-indicator">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Reply to Bot..."
            className="message-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            <Send className="send-icon" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
