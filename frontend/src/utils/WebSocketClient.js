import { useState, useEffect } from 'react';

// Simulated game economy data
const simulateGameData = () => ({
  economy: {
    currency: Math.floor(Math.random() * 1000),
    resources: {
      gold: Math.floor(Math.random() * 100),
      gems: Math.floor(Math.random() * 50),
      energy: Math.floor(Math.random() * 100)
    }
  },
  players: {
    active: Math.floor(Math.random() * 1000),
    paying: Math.floor(Math.random() * 100)
  },
  metrics: {
    retention: Math.random() * 100,
    monetization: Math.random() * 100,
    engagement: Math.random() * 100
  }
});

const useGameData = () => {
  const [gameData, setGameData] = useState(simulateGameData());
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Update data every 5 seconds
    const interval = setInterval(() => {
      setGameData(simulateGameData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (message) => {
    console.log('Simulated message sent:', message);
    // Simulate response
    setTimeout(() => {
      setGameData(simulateGameData());
    }, 500);
  };

  return {
    gameData,
    isConnected,
    sendMessage
  };
};

export default useGameData;
