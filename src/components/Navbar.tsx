import React from 'react';

export const Navbar = () => {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1200px] px-6">
      <div className="bg-white rounded-full px-6 py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12c2.5-4 5.5-4 8 0s5.5 4 8 0" />
            </svg>
          </div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight font-stack">Habitline</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors">What's inside</a>
          <a href="#" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors">Use case</a>
          <a href="#" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors">Metrics</a>
          <a href="#" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors">Smart Assist</a>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors border border-neutral-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors border border-neutral-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
