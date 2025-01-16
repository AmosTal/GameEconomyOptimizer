import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function MonetizationInsights() {
  const [monetizationData, setMonetizationData] = useState(null);

  const fetchMonetizationInsights = async () => {
    try {
      const response = await axios.post('/analyze/monetization');
      setMonetizationData(response.data);
    } catch (error) {
      console.error('Monetization analysis failed:', error);
    }
  };

  useEffect(() => {
    fetchMonetizationInsights();
  }, []);

  const adRewardData = {
    labels: Object.keys(monetizationData?.ad_reward_impact || {}),
    datasets: [{
      label: 'Ad Reward Engagement',
      data: Object.values(monetizationData?.ad_reward_impact || {}).map(impact => impact.engagement_rate),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ]
    }]
  };

  const iapPerformanceData = {
    labels: Object.keys(monetizationData?.iap_performance || {}),
    datasets: [{
      label: 'IAP Total Sales',
      data: Object.values(monetizationData?.iap_performance || {}).map(perf => perf.total_sales),
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Monetization Insights</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Ad Reward Impact */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Ad Reward Engagement</h3>
          <Pie data={adRewardData} />
        </div>

        {/* In-App Purchase Performance */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">IAP Performance</h3>
          <Bar data={iapPerformanceData} />
        </div>
      </div>

      {/* Subscription Performance */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Subscription Performance</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Tier</th>
              <th className="p-2 text-right">Total Subscribers</th>
              <th className="p-2 text-right">Total Revenue</th>
              <th className="p-2 text-right">Avg. Subscription Duration</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monetizationData?.subscription_performance || {}).map(([tier, data]) => (
              <tr key={tier} className="border-b">
                <td className="p-2">{tier}</td>
                <td className="p-2 text-right">{data.total_subscribers}</td>
                <td className="p-2 text-right">${data.total_revenue.toFixed(2)}</td>
                <td className="p-2 text-right">{data.average_subscription_duration.toFixed(1)} months</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MonetizationInsights;
