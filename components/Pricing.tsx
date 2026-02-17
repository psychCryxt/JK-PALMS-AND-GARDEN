import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from './GlassUI';
import { useData } from '../context/DataContext';
import { Tag, MapPin, Target, Smile, Star, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const { pricing } = useData();

  const categories = ['Venue', 'Activity', 'Entry'];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'activity': return <Target className="text-emerald-500" />;
      case 'home': return <MapPin className="text-emerald-500" />;
      case 'tree': return <Star className="text-emerald-500" />;
      case 'smile': return <Smile className="text-emerald-500" />;
      default: return <Tag className="text-emerald-500" />;
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-white mb-4"
          >
            Transparent Pricing
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect setting for your next event or activity. No hidden fees, just pure joy.
          </p>
        </div>

        {categories.map((cat) => {
          const catItems = pricing.filter(p => p.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white border-l-4 border-emerald-500 pl-4">{cat}s</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {catItems.map((item, idx) => (
                  <GlassCard key={item.id} hoverEffect className="flex flex-col h-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       {getIcon(item.icon)}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                       <div className="bg-emerald-500/10 p-2 rounded-lg">
                         {getIcon(item.icon)}
                       </div>
                       <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.title}</h3>
                    </div>

                    <div className="mb-4">
                       <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₦{item.price.toLocaleString()}</span>
                       <span className="text-gray-500 text-sm ml-1">/{item.unit.replace('per ', '')}</span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                      {item.description}
                    </p>

                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                         <Check size={14} /> Full access included
                       </div>
                       <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                         <Check size={14} /> Security guaranteed
                       </div>
                    </div>

                    <Link to="/booking">
                      <GlassButton className="w-full text-sm py-2">
                        Book Now <ArrowRight size={16} />
                      </GlassButton>
                    </Link>
                  </GlassCard>
                ))}
              </div>
            </div>
          );
        })}

        {/* Info Banner */}
        <GlassCard className="mt-12 bg-emerald-500/5 border-emerald-500/20 text-center py-10">
           <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Planning a custom event?</h3>
           <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
             For specialized requests, group discounts, or long-term bookings, please contact our management team directly.
           </p>
           <div className="flex justify-center gap-4">
              <a href="tel:+2348118861619" className="text-emerald-600 font-bold hover:underline">Call Us</a>
              <span className="text-gray-400">|</span>
              <a href="mailto:jkplams20@gmail.com" className="text-emerald-600 font-bold hover:underline">Email Us</a>
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Pricing;