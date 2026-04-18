import React from 'react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background with blur and specific orange/warm tone */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-[2px] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513]/20 via-transparent to-[#1a1a1a] z-20" />
        <img 
          src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero Background" 
          className="w-full h-full object-cover blur-3xl opacity-60 scale-110 rotate-3"
        />
      </div>

      <div className="relative z-30 max-w-[1000px] px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-10">
          <span className="bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>
          <span className="text-white/90 text-[13px] font-medium">A calmer way to build habits</span>
        </div>

        <h1 className="text-white text-6xl md:text-[110px] font-bold tracking-tight mb-10 leading-[0.95] font-stack">
          Build habits that <br /> actually stick
        </h1>

        <p className="text-neutral-300 text-lg md:text-[22px] max-w-2xl mx-auto mb-14 leading-[1.4] font-google">
          You see the right habits at the right time <br className="hidden md:block" /> so your day never feels crowded.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button className="px-10 py-5 bg-white text-neutral-900 rounded-full font-bold hover:bg-neutral-100 transition-all active:scale-95 shadow-2xl shadow-white/5 text-[17px]">
            Start tracking for free
          </button>
          <button className="px-10 py-5 bg-neutral-900/40 text-white border border-white/10 rounded-full font-bold hover:bg-neutral-900/60 transition-all active:scale-95 flex items-center gap-3 backdrop-blur-md text-[17px]">
            <div className="w-7 h-7 flex items-center justify-center bg-white rounded-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            Watch demo
          </button>
        </div>
      </div>
    </section>
  );
};
