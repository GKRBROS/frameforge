import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const AppMockup = () => {
  return (
    <div className="relative z-10 w-full max-w-[1200px] px-6 py-20">
      <div className="relative flex items-center justify-center">
        {/* Central Mockup - The Demo Interface */}
        <div className="relative z-20 w-[320px] h-[640px] bg-[#050505] rounded-[48px] border-[8px] border-neutral-800 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden p-6 font-sans">
          {/* Phone Top Bar */}
          <div className="flex justify-between items-center mb-10 px-2 opacity-40">
            <span className="text-white text-[10px] font-bold tracking-tighter">Frame Forge OS</span>
            <div className="w-14 h-5 bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-white fill-white" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
          </div>
          
          <div className="space-y-1 mb-8">
            <h2 className="text-white text-2xl font-serif font-bold tracking-tight">AI Generation</h2>
            <p className="text-[#FF4500] text-[10px] font-bold uppercase tracking-[0.2em]">Live Processing</p>
          </div>

          {/* Process Steps */}
          <div className="space-y-5">
            {[
              { title: "Upload Portrait", status: "Completed", icon: Upload, active: false, done: true },
              { title: "Identity Mapping", status: "Processing...", icon: ShieldCheck, active: true, done: false },
              { title: "Cinematic Rendering", status: "Pending", icon: Sparkles, active: false, done: false },
            ].map((step, i) => (
              <div key={i} className={`rounded-2xl p-4 flex flex-col gap-3 transition-all duration-500 border ${step.active ? 'bg-[#FF4500]/5 border-[#FF4500]/20 shadow-lg shadow-[#FF4500]/5' : 'bg-white/[0.03] border-white/5'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-emerald-500/20 text-emerald-500' : step.active ? 'bg-[#FF4500]/20 text-[#FF4500]' : 'bg-white/5 text-gray-500'}`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${step.active ? 'text-white' : 'text-gray-400'}`}>{step.title}</h4>
                      <p className={`text-[9px] font-medium uppercase tracking-widest ${step.active ? 'text-[#FF4500] animate-pulse' : 'text-gray-600'}`}>{step.status}</p>
                    </div>
                  </div>
                  {step.done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                {step.active && (
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/2 bg-[#FF4500]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Result Preview Mockup */}
          <div className="mt-8 relative rounded-2xl overflow-hidden aspect-[4/5] bg-white/5 border border-white/5 group">
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#FF4500]/20 animate-spin-slow" />
             </div>
             <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white font-bold uppercase tracking-widest">Asset Ready</p>
                <p className="text-[8px] text-gray-400">Cinematic Male v2.4</p>
             </div>
          </div>
        </div>

        {/* Left Floating Card - Accuracy Stat */}
        <div className="absolute left-8 md:left-32 top-[40%] z-10 w-[220px] p-6 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl hidden lg:block transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="w-14 h-14 bg-[#FF4500]/20 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#FF4500]" />
          </div>
          <p className="text-white font-bold text-base text-center font-serif leading-tight">99.8% Identity Preservation</p>
          <p className="text-gray-500 text-[10px] text-center mt-2 uppercase tracking-widest">Pixel-perfect mapping</p>
        </div>

        {/* Right Floating Card - Speed Stat */}
        <div className="absolute right-8 md:right-32 top-[55%] z-10 w-[220px] p-6 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl hidden lg:block transform rotate-3 hover:rotate-0 transition-transform duration-500">
           <div className="flex justify-center mb-4">
              <Zap className="w-10 h-10 text-emerald-500 fill-emerald-500/20" />
           </div>
          <p className="text-white font-bold text-base text-center font-serif leading-tight">Under 90 Seconds</p>
          <p className="text-gray-500 text-[10px] text-center mt-2 uppercase tracking-widest">Ultra-fast generation</p>
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1.5 h-6 bg-emerald-500/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${20 * i}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="w-full bg-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Top-Right Badge */}
        <div className="absolute right-12 md:right-24 top-[30%] z-30 bg-[#FF4500] text-white px-5 py-2.5 rounded-full shadow-2xl hidden md:flex items-center gap-3 transform -rotate-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Try the Demo</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
