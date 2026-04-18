import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader = ({ onFinished }: { onFinished: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onFinished, 500);
                    return 100;
                }
                const increment = Math.floor(Math.random() * 10) + 5;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onFinished]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
                y: "-100%",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] p-12"
        >
            <div className="w-full max-w-4xl flex flex-col items-start gap-4">
                <div className="flex items-center gap-6">
                   <div className="h-[2px] w-24 bg-[#FF4500] origin-left scale-x-0 animate-[scaleX_2s_ease-out_forwards]"></div>
                   <span className="text-xs uppercase tracking-[0.3em] font-light text-gray-500">Initializing Environment</span>
                </div>
                
                <h1 className="text-8xl md:text-[12vw] font-bold tracking-tighter text-white leading-none overflow-hidden">
                    <motion.span
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="block"
                    >
                        FRAME FORGE.
                    </motion.span>
                </h1>
                
                <div className="mt-20 w-full flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#FF4500]">System going online</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-8xl font-serif italic text-white leading-none">
                                {progress === 100 ? "100" : progress.toString().padStart(2, '0')}
                            </span>
                            <span className="text-xl md:text-2xl text-white/40">%</span>
                        </div>
                    </div>
                    
                    <div className="max-w-[200px] text-right hidden md:block">
                        <p className="text-[10px] text-gray-400 uppercase leading-loose tracking-[0.2em] font-light">
                            Creative Agentic Workspace<br />
                            Processing visual tokens<br />
                            v1.0.4-deployment
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Texture for Loader */}
            <div className="absolute inset-0 z-[-1] opacity-20 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-white/5 border-[1px] rounded-full"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-white/5 border-[1px] rounded-full"></div>
            </div>
        </motion.div>
    );
};
