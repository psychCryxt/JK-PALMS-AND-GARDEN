import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Booking from './components/Booking';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Main Gradient */}
          <div className="absolute inset-0 gradient-bg opacity-30 dark:opacity-20"></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/40 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-[120px]"></div>
          <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-yellow-200/20 dark:bg-purple-900/30 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;