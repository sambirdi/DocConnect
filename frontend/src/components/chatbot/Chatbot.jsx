import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './ChatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import { FiMessageSquare } from 'react-icons/fi';

const ChatbotComponent = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  // Initialize chatbot with persisted messages
  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem('chatbotMessages') || '[]');
    return savedMessages.length > 0 ? savedMessages : config.initialMessages;
  };

  useEffect(() => {
    // Clear messages on mount to avoid stale data (optional)
    localStorage.removeItem('chatbotMessages');
  }, []);

  return (
    <div>
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-navy text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-navy/90 transition-all duration-300 z-[1000]"
      >
        {showChatbot ? '✕' : <FiMessageSquare className="w-6 h-6" />}
      </button>
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 z-[1000]">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            messageHistory={loadMessages()}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;