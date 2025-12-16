import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, TreePalm } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logo } = useData();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Events', path: '/#events' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Book Now', path: '/booking', isCta: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {logo ? (
            <img 
              src={logo} 
              alt="JK Palms Logo" 
              className="h-10 w-auto object-contain rounded-lg hover:scale-105 transition-transform" 
            />
          ) : (
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg group-hover:rotate-12 transition-transform">
              <TreePalm className="text-white w-6 h-6" />
            </div>
          )}
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-800 dark:from-emerald-300 dark:to-teal-500">
            JK Palms
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${
                link.isCta
                  ? 'px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all'
                  : 'text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-gray-800 dark:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/20 text-gray-800 dark:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 glass-panel rounded-2xl p-4 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-center py-2 rounded-lg ${
                  link.isCta
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-gray-800 dark:text-white hover:bg-white/20'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;