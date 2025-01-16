import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { simulateEconomy } from '../utils/GameLogic';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    title: {
      display: true,
      text: 'Game Economy Metrics',
      color: 'rgba(255, 255, 255, 0.8)'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    }
  }
};

function EconomySimulator() {
  const [simulationConfig, setSimulationConfig] = useState({
    daily_login_reward: 10,
    win_reward: 25,
    board_unlock_cost: 500
  });

  const [insights, setInsights] = useState(null);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setSimulationConfig(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const runSimulation = () => {
    const results = simulateEconomy(simulationConfig);
    setInsights(results);
  };

  const monetizationData = {
    labels: Object.keys(insights?.monetization_insights || {}),
    datasets: [
      {
        label: 'Average Tokens',
        data: Object.values(insights?.monetization_insights || {}).map(i => i.avg_tokens),
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1
      },
      {
        label: 'Active Players',
        data: Object.values(insights?.monetization_insights || {}).map(i => i.active_players / 10),
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1
      }
    ]
  };

  const revenueData = {
    labels: Object.keys(insights?.monetization_insights || {}),
    datasets: [{
      label: 'Daily Revenue ($)',
      data: Object.values(insights?.monetization_insights || {}).map(i => i.total_revenue),
      borderColor: 'rgb(52, 211, 153)',
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white/90">Economy Simulator</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* Config Cards */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <label className="block text-sm font-medium text-white/80 mb-2">Daily Login Reward</label>
          <p className="text-sm text-white/60 mb-3">Tokens given to players for logging in each day</p>
          <input 
            type="number" 
            name="daily_login_reward"
            value={simulationConfig.daily_login_reward}
            onChange={handleConfigChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <label className="block text-sm font-medium text-white/80 mb-2">Win Reward</label>
          <p className="text-sm text-white/60 mb-3">Tokens awarded for winning a game</p>
          <input 
            type="number" 
            name="win_reward"
            value={simulationConfig.win_reward}
            onChange={handleConfigChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <label className="block text-sm font-medium text-white/80 mb-2">Board Unlock Cost</label>
          <p className="text-sm text-white/60 mb-3">Tokens needed to unlock new content</p>
          <input 
            type="number" 
            name="board_unlock_cost"
            value={simulationConfig.board_unlock_cost}
            onChange={handleConfigChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={runSimulation}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl text-white font-semibold"
        >
          Run Simulation
        </button>
      </div>

      {/* Charts */}
      {insights && (
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Token Distribution</h3>
            <div className="h-[400px]">
              <Bar data={monetizationData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Revenue Projection</h3>
            <div className="h-[400px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Simulation Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-white/60">Average Daily Players</p>
                <p className="text-3xl font-bold text-blue-400">
                  {Math.round(Object.values(insights.monetization_insights)[0].active_players)}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-white/60">Average Daily Tokens</p>
                <p className="text-3xl font-bold text-green-400">
                  {Math.round(Object.values(insights.monetization_insights)[0].avg_tokens)}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-white/60">Projected Monthly Revenue</p>
                <p className="text-3xl font-bold text-purple-400">
                  ${Math.round(Object.values(insights.monetization_insights).reduce((sum, day) => sum + day.total_revenue, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EconomySimulator;
