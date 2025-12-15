import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0, hoverEffect = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={hoverEffect ? { scale: 1.02, y: -5 } : {}}
      className={`glass-panel rounded-2xl p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-emerald-500/30 hover:scale-105 border border-white/20",
    secondary: "bg-white/10 text-emerald-900 dark:text-white border border-white/30 hover:bg-white/20 hover:scale-105 backdrop-blur-md"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};