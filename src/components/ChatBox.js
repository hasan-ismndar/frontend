import { useEffect, useState, useRef } from 'react';
import styles from '../styles/components/ChatBox.module.css';

export default function ChatBox({ socket, currentProject, messagesHistory }) {
  const [messages, setMessages] = useState(messagesHistory);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (messagesHistory?.length) {
      setMessages(messagesHistory);
    }
  }, [messagesHistory]);

  useEffect(() => {
    if (!socket || !currentProject) return;

    const handleMessage = (msg) => {
      if (msg.roomId === currentProject) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('room-message', handleMessage);

    return () => {
      socket.off('room-message', handleMessage);
    };
  }, [socket, currentProject]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    socket.emit('send-room-message', {
      roomId: currentProject,
      content: input,
    });

    setInput('');
  };
  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            <strong>{msg.username}:</strong> <span>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputForm} onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">إرسال</button>
      </form>
    </div>
  );
}
