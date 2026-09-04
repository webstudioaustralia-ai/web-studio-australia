import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaCircle } from 'react-icons/fa';
import io from 'socket.io-client';
import '../styles/livechat.css';

function LiveChat({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can we help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = io(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current.on('message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.content,
        sender: 'bot',
        timestamp: new Date()
      }]);
    });

    socketRef.current.on('error', (error) => {
      console.error('Chat error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

      // Send to server
      if (socketRef.current) {
        socketRef.current.emit('message', {
          content: inputValue,
          timestamp: new Date()
        });
      }

      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: 'Thank you for your message! Our team will get back to you soon.',
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  return (
    <div className={`live-chat ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">
          <h3>Chat with us</h3>
          <div className="online-status">
            <FaCircle className="status-icon" /> We're online!
          </div>
        </div>
        <div className="chat-actions">
          <button
            className="chat-minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title="Minimize"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            className="chat-close-btn"
            onClick={onClose}
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message message-${msg.sender}`}
              >
                <p>{msg.text}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn">
              <FaPaperPlane />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default LiveChat;
