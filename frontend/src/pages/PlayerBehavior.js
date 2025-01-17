import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { analyzePlayerBehavior } from '../utils/GameLogic';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function PlayerBehavior() {
  const [playerConfig, setPlayerConfig] = useState({
    retention_rate: 60,
    progression_level: 40,
    iap_count: 2
  });

  const [behaviorAnalysis, setBehaviorAnalysis] = useState(null);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setPlayerConfig(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const analyzeBehavior = () => {
    const results = analyzePlayerBehavior(playerConfig);
    setBehaviorAnalysis(results);
  };

  const archetypeComparisonData = {
    labels: ['Retention Rate', 'Sessions', 'Progression', 'IAP Count', 'Engagement'],
    datasets: Object.entries(behaviorAnalysis?.archetype_comparison || {}).map(([archetype, data], index) => ({
      label: archetype,
      data: [
        data.avg_retention_rate,
        data.avg_sessions,
        data.avg_progression,
        data.avg_iap_count,
        data.avg_engagement_score
      ],
      backgroundColor: `rgba(${75 + index * 70}, ${192 - index * 50}, 192, 0.2)`,
      borderColor: `rgba(${75 + index * 70}, ${192 - index * 50}, 192, 1)`
    }))
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Player Behavior Analysis</h2>
      
      {/* Player Configuration */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Retention Rate (%)</label>
          <input 
            type="number" 
            name="retention_rate"
            value={playerConfig.retention_rate}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Progression Level</label>
          <input 
            type="number" 
            name="progression_level"
            value={playerConfig.progression_level}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>In-App Purchases</label>
          <input 
            type="number" 
            name="iap_count"
            value={playerConfig.iap_count}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button 
        onClick={analyzeBehavior}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Analyze Player Behavior
      </button>

      {/* Analysis Results */}
      {behaviorAnalysis && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Archetype Comparison</h3>
            <Radar data={archetypeComparisonData} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Player Metrics</h3>
            <div className="bg-gray-100 p-4 rounded">
              <p>Retention Score: {(behaviorAnalysis.player_metrics.retention_score * 100).toFixed(1)}%</p>
              <p>Progression Score: {(behaviorAnalysis.player_metrics.progression_score * 100).toFixed(1)}%</p>
              <p>Purchase Score: {(behaviorAnalysis.player_metrics.purchase_score * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerBehavior;
