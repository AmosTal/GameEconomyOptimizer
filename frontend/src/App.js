import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import EconomySimulator from './pages/EconomySimulator';
import PlayerBehavior from './pages/PlayerBehavior';
import MonetizationInsights from './pages/MonetizationInsights';

function App() {
  return (
    <Router basename="/GameEconomyOptimizer">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <header className="bg-opacity-90 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Game Economy Simulator
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/simulator" element={<EconomySimulator />} />
            <Route path="/player-behavior" element={<PlayerBehavior />} />
            <Route path="/monetization" element={<MonetizationInsights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
