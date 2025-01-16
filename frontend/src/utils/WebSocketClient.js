import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://web-production-cd87.up.railway.app';

const useWebSocket = (url = BACKEND_URL) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(url);

    // Connection opened
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    // Listen for messages
    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setLastMessage(event.data);
    };

    // Connection closed
    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    // Error handling
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Set socket state
    setSocket(ws);

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, isConnected, lastMessage, sendMessage };
};

export default useWebSocket;
