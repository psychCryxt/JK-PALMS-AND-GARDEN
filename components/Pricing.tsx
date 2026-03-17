import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassUI';
import { useData } from '../context/DataContext';
import { DRINKS_MENU } from '../constants';
import { Instagram, Facebook, Info, Palmtree, Beer, Coffee, Wine } from 'lucide-react';

const Pricing: React.FC = () => {
  const { pricing, logo } = useData();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BEVERAGES': return <Coffee className="text-emerald-500" size={20} />;
      case 'ENERGY DRINKS': return <Palmtree className="text-emerald-500" size={20} />;
      case 'BEER': return <Beer className="text-emerald-500" size={20} />;
      case 'WINE, GIN, SPIRIT': return <Wine className="text-emerald-500" size={20} />;
      default: return <Palmtree className="text-emerald-500" size={20} />;
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Tropical Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12 text-center overflow-hidden rounded-3xl p-8 md:p-12 bg-emerald-900/10 dark:bg-emerald-900/20 border border-emerald-500/20"
        >
          {/* Decorative Tropical Elements */}
          <div className="absolute -top-10 -left-10 opacity-10 dark:opacity-20 pointer-events-none">
            <Palmtree size={200} className="text-emerald-600" />
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 dark:opacity-20 pointer-events-none transform rotate-180">
            <Palmtree size={200} className="text-emerald-600" />
          </div>

          <div className="relative z-10">
            {logo ? (
              <img src={logo} alt="JK Palms Logo" className="h-24 mx-auto mb-6 drop-shadow-lg" />
            ) : (
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <Palmtree size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">JK PALMS</h1>
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white uppercase tracking-widest mb-2">
              DRINKS SELLING PRICES
            </h2>
            <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
        </motion.div>

        {/* Drinks Menu Sections */}
        <div className="space-y-12">
          {DRINKS_MENU.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-2">
                {getCategoryIcon(cat.category)}
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                  {cat.category}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {cat.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx} 
                    className="flex items-end justify-between group py-1 border-b border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </span>
                    <div className="flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-600 mb-1 opacity-50"></div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer & Socials */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 space-y-8"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm italic text-center">
            <Info size={16} />
            <p>THESE PRICES ARE SUBJECT TO CHANGE WITHOUT NOTICE</p>
          </div>

          <GlassCard className="bg-emerald-500/5 border-emerald-500/10 p-8 text-center">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-6 uppercase tracking-tight">
              FOR COMPLAIN OR SUGGESTION:
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <a 
                href="https://instagram.com/jkpalms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors group"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-emerald-500/20 transition-all">
                  <Instagram size={20} />
                </div>
                <span className="font-medium">@jkpalms</span>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors group"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-emerald-500/20 transition-all">
                  <Facebook size={20} />
                </div>
                <span className="font-medium">Jk Palms & Garden</span>
              </a>
            </div>
          </GlassCard>
        </motion.div>

        {/* Original Pricing Section (Optional/Secondary) */}
        {pricing.length > 0 && (
          <div className="mt-32 pt-20 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Venue & Activity Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricing.map((item) => (
                <GlassCard key={item.id} className="p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-600">₦{item.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/{item.unit}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
