import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { InteractiveTravelCard } from '../components/ui/3d-card';
import heroMockup from '../assets/frameforge/hero-mockup.png';
import featureAiVisuals from '../assets/frameforge/feature-ai-visuals.jpeg';

export const Home = () => {
    const { time } = useOutletContext<{ time: string }>();

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-screen">
                        <img src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024" alt="Atmosphere" className="w-full h-full object-cover object-center opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
                </div>

                {/* Floating Surrealist Elements - Hanging Cards */}
                <div className="absolute top-[6%] left-[3%] md:top-[8%] md:left-[4%] z-10 opacity-80 origin-top-left -rotate-6 animate-float-left scale-90" style={{ perspective: "1000px" }}>
                     <InteractiveTravelCard 
                         title="" 
                         subtitle="" 
                         imageUrl={featureAiVisuals} 
                         actionText="" 
                         href="#" 
                         onActionClick={() => {}} 
                         className="w-[40vw] min-w-[280px] max-w-[350px] h-[400px] md:h-[450px] border-white/10 [&>div>div]:hidden"
                     />
                </div>

                <div className="absolute bottom-[5%] right-[2%] md:bottom-[8%] md:right-[4%] z-10 opacity-80 origin-bottom-right rotate-6 animate-float-right scale-90" style={{ perspective: "1000px" }}>
                     <InteractiveTravelCard 
                         title="" 
                         subtitle="" 
                         imageUrl={heroMockup} 
                         actionText="" 
                         href="#" 
                         onActionClick={() => {}} 
                         className="w-[40vw] min-w-[280px] max-w-[350px] h-[400px] md:h-[450px] border-white/10 [&>div>div]:hidden"
                     />
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center h-full">
                    <div id="hero-content-wrapper" className="max-w-4xl mx-auto mt-12">
                        <div className="reveal">
                            <h1 className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif" 
                                style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                                Frame Forge. <br />
                                <span className="italic font-light text-[#ffe0e0]">Visual Engagement.</span>
                            </h1>
                        </div>
                        
                        <div className="reveal" style={{ transitionDelay: "200ms" }}>
                            <p className="text-base md:text-lg text-[#ffe0e0]/90 max-w-lg mx-auto mb-16 font-light tracking-wide leading-relaxed mix-blend-overlay"
                               style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                                Create stunning custom frames, smart digital badges, and AI-generated visuals that boost attendee engagement and maximize your event's visibility.
                            </p>
                        </div>

                        <div className="reveal flex flex-col items-center gap-6" style={{ transitionDelay: "400ms" }}>
                            <div className="relative group cursor-pointer">
                               <div className="absolute inset-0 bg-[#FF4500]/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                               <div className="relative border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-3 text-xs md:text-sm text-white/80 uppercase tracking-widest hover:bg-white/10 transition-colors duration-300">
                                 <span>Watch Demo</span>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-8 font-mono">
                               <span id="current-time">{time}</span>
                               <span className="w-px h-3 bg-white/20"></span>
                               <span>WAITLIST: OPEN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="expertise" className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center reveal">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight text-white/90 mb-12 font-serif">
                            Everything you need to create memorable, shareable event experiences.
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
                            We provide the visual tools so your attendees resonate with your brand and become your best marketers.
                        </p>
                    </div>

                    {/* Logo Grid */}
                    <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="reveal font-bold text-xl tracking-widest text-[#FF4500] mix-blend-screen animate-glow">FRAMES</div>
                        <div className="reveal font-bold text-xl tracking-widest text-[#FF4500] mix-blend-screen animate-glow" style={{ transitionDelay: "100ms" }}>BADGES</div>
                        <div className="reveal font-bold text-xl tracking-widest text-[#FF4500] mix-blend-screen animate-glow" style={{ transitionDelay: "200ms" }}>AI VISUALS</div>
                        <div className="reveal font-bold text-xl tracking-widest text-[#FF4500] mix-blend-screen animate-glow" style={{ transitionDelay: "300ms" }}>CUSTOM DESIGN</div>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section id="works" className="py-40 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="reveal mb-32">
                        <h2 className="text-5xl md:text-7xl text-center font-serif">
                            Define your <br />
                            <span className="italic">digital presence</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Card 1 - Red */}
                        <div className="parallax-card-down">
                            <div className="reveal bg-[#FF4500] rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.3)] transition-all duration-500 group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                                        <Star className="text-black w-6 h-6" />
                                    </div>
                                    <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">01</span>
                                </div>
                                
                                <div>
                                    <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight font-serif">
                                        AI Event <br />Frames
                                    </h3>
                                    <p className="text-black/70 text-lg leading-snug">
                                        Custom-designed photo frames that perfectly match your event branding and theme.
                                    </p>
                                </div>
                                
                                <div className="w-full h-px bg-black/10 mt-8"></div>
                            </div>
                        </div>

                        {/* Card 2 - Black */}
                        <div className="parallax-card-up md:mt-24">
                            <div className="reveal bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500" style={{ transitionDelay: "150ms" }}>
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                       <ArrowRight className="text-white w-6 h-6 -rotate-45" />
                                    </div>
                                    <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">02</span>
                                </div>
                                
                                <div>
                                    <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight font-serif">
                                        Smart <br />Badges
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-snug">
                                        Digital badges that attendees can share across social platforms to amplify reach.
                                    </p>
                                </div>
                                
                                <div className="w-full h-px bg-white/10 mt-8"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
                     style={{ backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                </div>
            </section>
        </>
    );
};
