import React from 'react';
import { Star, ArrowRight, Frame, BadgeCheck, Wand2, Palette, TicketCheck } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const Services = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
                        <img src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024" alt="Atmosphere" className="w-full h-full object-cover object-center opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center">
                    <div className="reveal">
                        <h1 className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif" 
                            style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            Our Services. <br />
                        </h1>
                    </div>
                    <div className="reveal" style={{ transitionDelay: "200ms" }}>
                        <p className="text-base md:text-lg text-[#ffe0e0]/90 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mix-blend-overlay"
                           style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            A complete suite of AI-powered tools and creative services designed to transform your events into unforgettable, shareable experiences.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        
                        {/* Service 1 - Red */}
                        <div className="parallax-card-down">
                            <div className="reveal bg-[#FF4500] rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.3)] transition-all duration-500 group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                        <Frame className="text-black w-6 h-6" />
                                    </div>
                                    <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">01</span>
                                </div>
                                <div>
                                    <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight font-serif">
                                        AI Event <br />Frames
                                    </h3>
                                    <p className="text-black/70 text-lg leading-snug">
                                        Transform ordinary photos into shareable branded content with perfectly aligned custom themes.
                                    </p>
                                </div>
                                <div className="w-full h-px bg-black/10 mt-8"></div>
                            </div>
                        </div>

                        {/* Service 2 - Black */}
                        <div className="parallax-card-up md:mt-24">
                            <div className="reveal bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                       <BadgeCheck className="text-white w-6 h-6" />
                                    </div>
                                    <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">02</span>
                                </div>
                                <div>
                                    <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight font-serif">
                                        Smart <br />Badges
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-snug">
                                        Digital identity that travels. Encourage organic social amplification effortlessly.
                                    </p>
                                </div>
                                <div className="w-full h-px bg-white/10 mt-8"></div>
                            </div>
                        </div>

                        {/* Service 3 - Red */}
                        <div className="parallax-card-down mt-8 md:mt-24">
                            <div className="reveal bg-[#FF4500] rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.3)] transition-all duration-500 group cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                        <Wand2 className="text-black w-6 h-6" />
                                    </div>
                                    <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full">03</span>
                                </div>
                                <div>
                                    <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight font-serif">
                                        AI <br />Visuals
                                    </h3>
                                    <p className="text-black/70 text-lg leading-snug">
                                        Harness cutting-edge AI to generate unique, eye-catching imagery on demand.
                                    </p>
                                </div>
                                <div className="w-full h-px bg-black/10 mt-8"></div>
                            </div>
                        </div>

                        {/* Service 4 - Black */}
                        <div className="parallax-card-up mt-8 md:mt-48">
                            <div className="reveal bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                       <Palette className="text-white w-6 h-6" />
                                    </div>
                                    <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">04</span>
                                </div>
                                <div>
                                    <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight font-serif">
                                        Custom <br />Design
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-snug">
                                        Bespoke design excellence crafting completely tailored visual experiences.
                                    </p>
                                </div>
                                <div className="w-full h-px bg-white/10 mt-8"></div>
                            </div>
                        </div>
                        
                        {/* Service 5 - Center spanning Black (since it's an odd number) */}
                        <div className="md:col-span-2 reveal mt-8 md:mt-24">
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center shadow-2xl group cursor-pointer hover:border-[#FF4500]/50 transition-all duration-500">
                                <div className="flex flex-col md:w-2/3">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                           <TicketCheck className="text-white w-6 h-6" />
                                        </div>
                                        <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full">05</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight font-serif">
                                        Ticketing Integration
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-snug max-w-lg">
                                        Connect Frame Forge seamlessly with existing platforms for automated workflows.
                                    </p>
                                </div>
                                <div className="mt-8 md:mt-0 text-center md:text-right">
                                    <div className="grid grid-cols-2 gap-4 opacity-40">
                                        <span className="font-mono text-xs uppercase tracking-widest text-[#FF4500]">Eventbrite</span>
                                        <span className="font-mono text-xs uppercase tracking-widest text-white">Ticketmaster</span>
                                        <span className="font-mono text-xs uppercase tracking-widest text-white">Cvent</span>
                                        <span className="font-mono text-xs uppercase tracking-widest text-[#FF4500]">More+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};
