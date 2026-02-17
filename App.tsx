import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Booking from './components/Booking';
import AdminPanel from './components/AdminPanel';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const mouseOrbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseOrbRef.current) {
        // Simple follow with no delay for responsiveness
        const x = e.clientX - 300;
        const y = e.clientY - 300;
        
        mouseOrbRef.current.animate({
          transform: `translate(${x}px, ${y}px)`
        }, { duration: 1500, fill: "forwards", easing: "ease-out" });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <DataProvider>
      <Router>
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          
          {/* Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Main Gradient */}
            <div className="absolute inset-0 gradient-bg opacity-30 dark:opacity-20"></div>
            
            {/* Mouse Follower Orb - Uses Logo Green */}
            <div 
              ref={mouseOrbRef}
              className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/30 dark:bg-emerald-400/20 rounded-full blur-[100px] opacity-60"
            ></div>
            
            {/* Animated Orbs - Updated to match Logo Colors */}
            {/* Logo Green Orb */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/40 rounded-full blur-[100px] animate-pulse"></div>
            
            {/* Logo Sky Blue Orb (representing background circle in logo) */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-400/30 rounded-full blur-[120px]"></div>
            
            {/* Light Accent Orb */}
            <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-emerald-200/20 dark:bg-emerald-900/30 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;