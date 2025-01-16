# Game Economy Optimizer

A sophisticated tool for simulating and optimizing game economies, analyzing player behavior, and providing monetization insights.

## Features

- Economy Simulator
- Player Behavior Analysis
- Monetization Insights
- Real-time Data Visualization
- Performance-Optimized UI

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Python Flask
- Data Visualization: Chart.js
- Real-time Updates: Socket.IO

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/AmosTal/GameEconomyOptimizer.git
cd GameEconomyOptimizer
```

2. Start both servers:
```bash
python start_servers.py
```

This will:
- Set up Python virtual environment
- Install backend dependencies
- Install frontend dependencies
- Start both servers

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Railway Deployment

1. Create a new project on [Railway](https://railway.app/)

2. Connect your GitHub repository

3. Configure the following environment variables:
   - `PORT`: The port for the backend server
   - `FLASK_ENV`: Set to "production"
   - `REACT_APP_API_URL`: Your Railway backend URL

4. Deploy:
   - Railway will automatically detect the Procfile and deploy the backend
   - For the frontend, create a new service and select "Static Site"
   - Set the build command to: `cd frontend && npm install && npm run build`
   - Set the static build directory to: `frontend/build`

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## License

MIT License
