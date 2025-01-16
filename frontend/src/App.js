import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/BoardGameStyle.css';

// Lazy load pages
const EconomySimulator = lazy(() => import('./pages/EconomySimulator'));
const PlayerBehavior = lazy(() => import('./pages/PlayerBehavior'));
const MonetizationInsights = lazy(() => import('./pages/MonetizationInsights'));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="dice-roll animate-pulse">🎲</div>
  </div>
);

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router basename="/GameEconomyOptimizer">
      <div className="min-h-screen board-container flex flex-col">
        {/* Mobile-Friendly Header */}
        <header className="bg-[#8B4513] text-white p-6 flex justify-between items-center">
          <h1 className="app-title text-2xl md:text-3xl font-bold">Game Economy Simulator</h1>
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden board-button p-3"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </header>

        {/* Mobile Navigation */}
        <nav className={`
          nav-menu
          ${isMobileMenuOpen ? 'block' : 'hidden'} 
          md:block bg-[#D2B48C] md:w-80 md:bg-transparent p-6
        `}>
          <ul className="flex flex-col space-y-8 p-4">
            {[
              { path: '/', label: 'Economy Simulator', icon: '💰' },
              { path: '/player-behavior', label: 'Player Behavior', icon: '👥' },
              { path: '/monetization', label: 'Monetization Insights', icon: '📊' }
            ].map(({ path, label, icon }) => (
              <li key={path} className="mb-4">
                <Link 
                  to={path} 
                  className="board-button flex items-center justify-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow p-4 mobile-scrollable">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<EconomySimulator />} />
              <Route path="/player-behavior" element={<PlayerBehavior />} />
              <Route path="/monetization" element={<MonetizationInsights />} />
            </Routes>
          </Suspense>
        </main>

        {/* Mobile-Friendly Footer */}
        <footer className="bg-[#8B4513] text-white p-4 text-center">
          <p> 2025 Game Economy Simulator</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
