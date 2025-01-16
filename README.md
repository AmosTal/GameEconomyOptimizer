# Game Economy Simulator

A React-based tool for simulating and balancing game economies. This simulator helps game developers optimize their in-game economy by modeling player behavior, token distribution, and revenue projections.

## Features

- Real-time economy simulation
- Token distribution analysis
- Player retention tracking
- Revenue projections
- Interactive parameter adjustment
- Visual data representation

## Key Parameters

### Daily Login Reward
Tokens given to players for logging in each day. Higher rewards increase player retention but might reduce purchases.
- Default: 10 tokens

### Win Reward
Tokens awarded for winning a game. Affects player engagement and token circulation in the economy.
- Default: 25 tokens

### Board Unlock Cost
Amount of tokens needed to unlock new content. Higher costs can increase revenue but might frustrate players.
- Default: 500 tokens

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/game-economy-simulator.git
```

2. Install dependencies
```bash
cd game-economy-simulator
cd frontend
npm install
```

3. Run the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## How It Works

The simulator calculates:
- Days required to unlock content
- Player retention rates
- Daily token earnings
- Warning indicators for potential issues

When the Board Unlock Cost is too high relative to daily earnings (Daily Login Reward + Win Reward), you'll see:
- Longer time to unlock content
- Lower player retention
- Warning messages about player frustration
- Reduced daily active players

## Technologies Used

- React
- Chart.js for data visualization
- Tailwind CSS for styling
