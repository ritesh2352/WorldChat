import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false); 

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));     
    socket.on("disconnect", () => setConnected(false)); 

    socket.on("message", ({ id, text }) => {
      setMessages((prev) => [...prev, { id, text }].slice(-50));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const remove = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current?.connected) return;
    socketRef.current.emit("message", message);
    setMessage("");
  };

  return (
    <main className="app">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="brand-copy">
          <p className="eyebrow">A little more connected</p>
          <h1>WorldChat</h1>
        </div>
        <div className="live-indicator">
          <span className={connected ? "live-dot" : "not-live-dot"} />
          <span>{connected?"live":"not-live"}</span>
        </div>
      </header>

      <section className="chat" aria-label="Live messages" aria-live="polite">
        {messages.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✦</span>
            <p>Your conversation starts here</p>
            <span>Send a message and watch it float by</span>
          </div>
        )}
        {messages.map((mes) => (
          <div
            key={mes.id}
            className="msg"
            onAnimationEnd={() => remove(mes.id)}
          >
            {mes.text}
          </div>
        ))}
      </section>

      <form className="composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="message">Write a message</label>
        <input
          type="text"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minLength={1}
          maxLength={200}
          placeholder="Say something lovely..."
          autoComplete="off"
        />
        <button type="submit" aria-label="Send message">
          <span>Send</span>
          <span className="send-icon" aria-hidden="true">↗</span>
        </button>
      </form>
    </main>
  );
}

export default App;