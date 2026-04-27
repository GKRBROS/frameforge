import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const isDemo = location.pathname === '/demo';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 group">
          <span className="text-2xl font-bold text-white tracking-tighter font-serif">
            FrameForge<span className="text-red-600">.</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link to="/services" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Services</Link>
          <Link to="/how-it-works" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">How It Works</Link>
          <Link to="/demo" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Demo</Link>
          <Link to="/integration" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Integration</Link>
        </div>

        <div className="flex items-center gap-4">
          {!isDemo && (
            <Link 
              to="/demo" 
              className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Get Started
            </Link>
          )}
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};
