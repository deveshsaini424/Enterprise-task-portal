import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext'; // Removed .jsx
import { Send, Loader2 } from 'lucide-react';

// Connect to your backend socket server
const socket = io('http://localhost:8080');

// Helper to get initials for avatar fallback
const getInitials = (name = '??') => {
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const ChatPanel = ({ projectId }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef(null); // To auto-scroll to bottom

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages change

  useEffect(() => {
    console.log(`[EFFECT] Running ChatPanel useEffect for projectId: ${projectId}`); 

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Socket connected');
      if (projectId) { 
          socket.emit('joinRoom', projectId);
      } else {
          console.error("ProjectId is undefined, cannot join room.");
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    const messageListener = (data) => {
      console.log("[FRONTEND] Received message:", data); 
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    socket.on('receiveMessage', messageListener);

    return () => {
      console.log(`[EFFECT] Cleaning up ChatPanel useEffect for projectId: ${projectId}`); 
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receiveMessage', messageListener);
    };
  }, [projectId]); // Dependency array includes projectId

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && user && isConnected) { 
      const messageData = {
        projectId,
        // Include user image if available, for potential avatar display
        author: { 
            name: user.name || 'Unknown User', 
            image: user.image 
        }, 
        message: message.trim(), 
        timestamp: new Date().toISOString(),
      };
      
      console.log("[FRONTEND] Emitting sendMessage with data:", messageData); 
      socket.emit('sendMessage', messageData);
      setMessage(''); 
    } else {
        console.warn("Could not send message. Connected:", isConnected, "User:", !!user, "Message:", message.trim());
    }
  };

  return (
    // Main Panel Styling
    <div className="bg-linear-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col h-[60vh] sm:h-[70vh] md:h-[600px] border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Project Chat</h3>
        <div 
          className={`w-3 h-3 rounded-full transition-colors duration-500 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} 
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
      </div>

      {/* Message Area Styling */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar"> {/* Added custom-scrollbar class if needed */}
        {messages.map((msg, index) => {
          // Check using user ID for reliability if available, fallback to name
          const isMe = user && (msg.author._id === user._id || msg.author.name === user.name); 
          const authorName = msg.author?.name || 'System';
          const authorImage = msg.author?.image;
          
          return (
            <div 
              key={index} 
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar (Show for others) */}
              {!isMe && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 overflow-hidden self-start">
                  {authorImage ? (
                    <img src={authorImage} alt={authorName} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'}/> // Handle image errors
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-600">
                      {getInitials(authorName)}
                    </span>
                  )}
                </div>
              )}
              
              {/* Message Bubble */}
              <div 
                  className={`p-3 rounded-xl max-w-[75%] sm:max-w-[70%] wrap-break-words shadow-sm ${
                      isMe 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
              >
                {!isMe && (
                  <p className="text-xs font-bold text-blue-500 mb-1">{authorName}</p> 
                )}
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p> 
              </div>
            </div>
          );
        })}
        {/* Empty div to auto-scroll to */}
        <div ref={messagesEndRef} />
        {!isConnected && messages.length === 0 && (
             <p className="text-sm text-gray-500 p-4 text-center italic">Connecting to chat...</p>
        )}
         {isConnected && messages.length === 0 && (
             <p className="text-sm text-gray-500 p-4 text-center italic">No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Message Input Form Styling */}
      <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 pt-3 border-t border-gray-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isConnected ? "Type your message..." : "Connecting..."}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 shadow-sm"
          disabled={!isConnected}
        />
        <button
          type="submit"
          className="flex items-center justify-center w-12 h-12 sm:w-auto sm:px-5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition disabled:bg-gray-400 disabled:shadow-none"
          disabled={!isConnected || !message.trim()}
          aria-label="Send message"
        >
          <Send size={18} className="sm:mr-1"/> <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

// Optional: Add custom scrollbar styles if needed (in your main CSS or style tag)
/* .custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0; 
}
*/

export default ChatPanel;

