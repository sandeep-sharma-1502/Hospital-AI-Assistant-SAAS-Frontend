import React from 'react';
import { motion } from 'framer-motion';

const VoiceOrb = ({ status = 'idle' }) => {
  const variants = {
    idle: { scale: 1, opacity: 0.5 },
    listening: { 
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: { repeat: Infinity, duration: 1.5 } 
    },
    processing: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 2, ease: "linear" }
    },
    speaking: {
      scale: [1, 1.1, 0.9, 1.1, 1],
      transition: { repeat: Infinity, duration: 0.8 }
    }
  };

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Outer Glow */}
      <motion.div 
        animate={status !== 'idle' ? { scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] } : {}}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute w-full h-full rounded-full bg-blue-400 blur-3xl"
      />
      
      {/* Main Orb */}
      <motion.div
        variants={variants}
        animate={status}
        className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 shadow-2xl flex items-center justify-center border-4 border-white/20 backdrop-blur-xl"
      >
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30" />
      </motion.div>
    </div>
  );
};

export default VoiceOrb;