import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center overflow-hidden bg-[#050505]">
      {/* Background with cinematic atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[1px] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF4500]/10 via-transparent to-[#050505] z-20" />
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
        />
      </div>

      <div className="relative z-30 max-w-[1100px] px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
        >
          <span className="bg-[#FF4500] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">Pro</span>
          <span className="text-white/80 text-[12px] font-medium tracking-wide">Identity-Preserving AI Generation</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-6xl md:text-[120px] font-serif font-bold tracking-tighter mb-8 leading-[0.85] uppercase"
        >
          Forge your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Digital Legacy.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-[24px] max-w-2xl mx-auto mb-16 leading-relaxed font-light tracking-wide"
        >
          High-fidelity AI visuals that preserve your unique identity. <br className="hidden md:block" /> 
          Cinematic portraits, campaign assets, and brand-consistent creative.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link to="/demo">
            <button className="px-12 py-6 bg-white text-black rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#FF4500] hover:text-white transition-all duration-500 active:scale-95 shadow-2xl shadow-white/5 flex items-center gap-3 group">
              Try the Demo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          <Link to="/how-it-works">
            <button className="px-12 py-6 bg-white/5 text-white border border-white/10 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-white/10 transition-all duration-500 active:scale-95 flex items-center gap-3 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#FF4500]" />
              The Tech
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
