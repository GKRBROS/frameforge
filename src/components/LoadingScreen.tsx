import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onLoadComplete }: { onLoadComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-950 to-black opacity-50" />

      {/* Main loading container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* P10 Logo/Text */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-wider animate-pulse">
            P10
          </h1>
          <p className="text-xl text-orange-500 font-semibold tracking-widest animate-pulse">
            PESQUERA DIEZ
          </p>
        </div>

        {/* Animated loading rings */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer ring - White */}
          <div className="absolute inset-0 border-4 border-white rounded-full animate-spin" 
            style={{ animationDuration: '3s' }} />

          {/* Middle ring - Orange */}
          <div className="absolute inset-2 border-4 border-orange-500 rounded-full animate-spin" 
            style={{ animationDuration: '2s', animationDirection: 'reverse' }} />

          {/* Inner ring - Black */}
          <div className="absolute inset-4 border-4 border-black rounded-full animate-spin" 
            style={{ animationDuration: '1.5s' }} />

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 flex items-center gap-2">
          <span className="text-white text-sm font-light tracking-widest">LOADING</span>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-12 w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-orange-500" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-orange-500" />
    </div>
  );
};

export default LoadingScreen;
