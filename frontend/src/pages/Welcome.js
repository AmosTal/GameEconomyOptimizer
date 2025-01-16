import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Game Economy Simulator
        </h1>
        <p className="text-xl text-white/80">
          Balance your game's economy by simulating player behavior and revenue
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold mb-4 text-white/90">Simulator Parameters</h2>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-green-400">Daily Login Reward</h3>
            <p className="text-white/70">
              Tokens given to players for logging in each day. Higher rewards increase player retention but might reduce purchases.
              <span className="block mt-1 text-sm text-white/50">Default: 10 tokens</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-blue-400">Win Reward</h3>
            <p className="text-white/70">
              Tokens awarded for winning a game. Affects player engagement and token circulation in the economy.
              <span className="block mt-1 text-sm text-white/50">Default: 25 tokens</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-purple-400">Board Unlock Cost</h3>
            <p className="text-white/70">
              Amount of tokens needed to unlock new content. Higher costs can increase revenue but might frustrate players.
              <span className="block mt-1 text-sm text-white/50">Default: 500 tokens</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold mb-4 text-white/90">What You'll See</h2>
        
        <div className="grid grid-cols-3 gap-6 text-white/70">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-green-400">Token Distribution</h3>
            <p>See how tokens spread across your player base over time</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-blue-400">Player Count</h3>
            <p>Track active players and their engagement levels</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-purple-400">Revenue</h3>
            <p>Project monthly revenue based on player spending patterns</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Link 
          to="/simulator" 
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl text-white font-semibold text-lg"
        >
          Open Simulator
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
