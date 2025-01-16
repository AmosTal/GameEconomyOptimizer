import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';

// Add base URL configuration
axios.defaults.baseURL = 'http://localhost:5000';

// WebSocket connection
const socket = io('http://localhost:5000');

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

function EconomySimulator() {
  const [simulationConfig, setSimulationConfig] = useState({
    daily_login_reward: 50,
    win_reward: 25,
    board_unlock_cost: 500
  });

  const [insights, setInsights] = useState(null);

  useEffect(() => {
    // WebSocket event listeners
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('simulation_result', (data) => {
      setInsights(data);
    });

    socket.on('simulation_error', (error) => {
      console.error('Simulation Error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('simulation_result');
      socket.off('simulation_error');
    };
  }, []);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setSimulationConfig(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const runSimulation = async () => {
    try {
      // Use WebSocket for simulation
      socket.emit('simulate_economy', { config: simulationConfig });
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  };

  const monetizationData = {
    labels: Object.keys(insights?.monetization_insights || {}),
    datasets: [{
      label: 'Average Tokens',
      data: Object.values(insights?.monetization_insights || {}).map(i => i.avg_tokens),
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Economy Simulator</h2>
      
      {/* Configuration Inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Daily Login Reward</label>
          <input 
            type="number" 
            name="daily_login_reward"
            value={simulationConfig.daily_login_reward}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Win Reward</label>
          <input 
            type="number" 
            name="win_reward"
            value={simulationConfig.win_reward}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Board Unlock Cost</label>
          <input 
            type="number" 
            name="board_unlock_cost"
            value={simulationConfig.board_unlock_cost}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button 
        onClick={runSimulation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Run Simulation
      </button>

      {/* Insights Display */}
      {insights && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Monetization Insights</h3>
            <Bar data={monetizationData} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Optimization Suggestions</h3>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(insights.optimization_suggestions, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default EconomySimulator;
