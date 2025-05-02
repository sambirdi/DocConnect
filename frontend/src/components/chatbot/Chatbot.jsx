import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './ChatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

const ChatbotComponent = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1e3a8a',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          zIndex: 1000,
        }}
      >
        {showChatbot ? 'X' : '💬'}
      </button>
      {showChatbot && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000 }}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;