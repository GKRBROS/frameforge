import { useEffect } from 'react';
import { ArrowRight, Wand2, Frame, BadgeCheck, Palette, Sparkles } from 'lucide-react';
import featureAiFrames from '../assets/frameforge/feature-ai-frames.png';
import featureSmartBadges from '../assets/frameforge/feature-smart-badges.png';
import featureAiVisuals from '../assets/frameforge/feature-ai-visuals.jpeg';
import featureCustomDesign from '../assets/frameforge/feature-custom-design.png';
import heroMockup from '../assets/frameforge/hero-mockup.png';

export const FrameForgePage = () => {
    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        const handleScroll = () => {
            const scrolled = window.scrollY;
            
            const nav = document.getElementById('main-nav');
            if (nav) {
                if (scrolled > 50) {
                    nav.classList.add('py-4', 'bg-[#050505]/80', 'backdrop-blur-md', 'border-b', 'border-white/5');
                    nav.classList.remove('py-8', 'bg-transparent');
                } else {
                    nav.classList.remove('py-4', 'bg-[#050505]/80', 'backdrop-blur-md', 'border-b', 'border-white/5');
                    nav.classList.add('py-8', 'bg-transparent');
                }
            }

            document.querySelectorAll<HTMLElement>('.parallax-card-up').forEach(el => {
                el.style.setProperty('--scroll-offset-up', `${scrolled * -0.05}px`);
            });
            document.querySelectorAll<HTMLElement>('.parallax-card-down').forEach(el => {
                el.style.setProperty('--scroll-offset-down', `${scrolled * 0.05}px`);
            });

            const heroWrapper = document.getElementById('hero-content-wrapper');
            if (heroWrapper) {
                if (scrolled < 1000) {
                    heroWrapper.style.transform = `translateY(${scrolled * 0.4}px)`;
                    heroWrapper.style.opacity = String(Math.max(0, 1 - scrolled / 600));
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            revealObserver.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#FF4500] selection:text-white overflow-x-hidden">
            <div className="noise-overlay"></div>

            {/* Navigation */}
            <nav id="main-nav" className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-8">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-3 text-2xl font-bold tracking-tighter font-serif">
                       <img src="/logo_white.png" alt="Frame Forge Logo" className="h-8 md:h-9 w-auto max-w-[220px] object-contain" />
                    </a>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#expertise" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Services</a>
                        <a href="#works" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">How It Works</a>
                        <a href="#perspectives" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Integration</a>
                    </div>

                    <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-white text-black hover:scale-105 hover:bg-gray-100 transition-all duration-300">
                        Get Started
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-start overflow-hidden pt-32 pb-20 bg-[#050505]">
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-screen">
                        {/* A very dark atmospheric tint to sit behind the UI */}
                        <div className="w-full h-full bg-gradient-to-r from-black via-transparent to-black" />
                    </div>
                </div>

                {/* Floating Mockup (Right Side) */}
                <div className="absolute right-[-10%] top-[10%] md:right-[-5%] md:top-[12%] z-10 opacity-90 animate-float-right scale-75 md:scale-95 lg:scale-100 transform origin-right">
                    <div className="pointer-events-none filter drop-shadow-[0_0_80px_rgba(255,255,255,0.15)] rounded-3xl overflow-hidden border border-white/10">
                        <img src={heroMockup} alt="Interactive Instagram Frame Mockup" className="max-w-[400px] lg:max-w-[500px] h-auto object-contain" />
                    </div>
                </div>

                {/* Hero Content aligned left */}
                <div className="container mx-auto px-6 relative z-20 flex flex-col items-start justify-center h-full">
                    <div id="hero-content-wrapper" className="max-w-2xl text-left">
                        <div className="reveal">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                                <Sparkles className="w-4 h-4 text-[#FF4500]" />
                                <span className="text-xs font-medium text-white/90 uppercase tracking-widest">AI-Powered Event Engagement</span>
                            </div>
                        </div>

                        <div className="reveal">
                            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8 text-white font-serif" 
                                style={{ textShadow: "0 0 20px rgba(255,255,255,0.1)" }}>
                                Transform Events with <br />
                                <span className="italic font-light text-[#FF4500]">Visual Engagement.</span>
                            </h1>
                        </div>
                        
                        <div className="reveal" style={{ transitionDelay: "200ms" }}>
                            <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-12 font-light tracking-wide leading-relaxed">
                                Create stunning custom frames, smart digital badges, and AI-generated visuals that boost attendee engagement and maximize your event's visibility.
                            </p>
                        </div>

                        <div className="reveal flex flex-wrap items-center gap-6" style={{ transitionDelay: "400ms" }}>
                            <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center gap-3">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </button>
                            
                            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all active:scale-95 flex items-center gap-3 backdrop-blur-md text-base">
                                See How It Works
                            </button>
                        </div>
                        
                        <div className="reveal mt-16 flex items-center gap-12 text-sm text-white/40 uppercase tracking-widest font-mono" style={{ transitionDelay: "600ms" }}>
                           <div>
                               <div className="text-2xl font-bold text-white mb-2">5K+</div>
                               <div className="text-xs">Photos Created</div>
                           </div>
                           <div className="w-px h-10 bg-white/20"></div>
                           <div>
                               <div className="text-2xl font-bold text-[#FF4500] mb-2">98%</div>
                               <div className="text-xs">Client Satisfaction</div>
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
                            What <span className="text-[#FF4500]">Frame Forge</span> Does
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light">
                            Everything you need to create memorable, shareable event experiences that drive genuine engagement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section id="works" className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto pb-32">
                        {/* Card 1 */}
                        <div className="parallax-card-down">
                            <div className="reveal bg-[#1A1A1A] border border-white/5 rounded-[32px] p-2 aspect-square flex flex-col justify-start shadow-2xl hover:border-white/10 transition-all duration-500 group overflow-hidden relative">
                                <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] bg-[#0b0b0b] md:bg-transparent">
                                    <img src={featureAiFrames} alt="AI Event Frames" className="w-full h-full object-contain md:object-cover object-center opacity-60 group-hover:scale-[1.02] group-hover:opacity-80 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                                </div>
                                
                                <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                                    <div className="w-12 h-12 mb-6 rounded-full bg-[#FF4500] flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500">
                                        <Frame className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl text-white mb-4 font-serif">
                                        AI Event Frames
                                    </h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        Custom-designed photo frames that perfectly match your event branding and theme.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="parallax-card-up md:mt-24">
                            <div className="reveal bg-[#111] border border-white/5 rounded-[32px] p-2 aspect-square flex flex-col justify-start shadow-2xl hover:border-[#FF4500]/50 transition-all duration-500 group overflow-hidden relative" style={{ transitionDelay: "150ms" }}>
                                <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] bg-[#0b0b0b] md:bg-transparent">
                                    <img src={featureSmartBadges} alt="Smart Badges" className="w-full h-full object-contain md:object-cover object-center opacity-60 group-hover:scale-[1.02] group-hover:opacity-80 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                                </div>
                                
                                <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                                    <div className="w-12 h-12 mb-6 rounded-full bg-white/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                                       <BadgeCheck className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl text-white mb-4 font-serif">
                                        Smart Badges
                                    </h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        Digital badges that attendees can share across social platforms to amplify reach.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="parallax-card-down">
                            <div className="reveal bg-[#111] border border-white/5 rounded-[32px] p-2 aspect-square flex flex-col justify-start shadow-2xl hover:border-white/10 transition-all duration-500 group overflow-hidden relative">
                                <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] bg-[#0b0b0b] md:bg-transparent">
                                    <img src={featureAiVisuals} alt="AI Visuals" className="w-full h-full object-contain md:object-cover object-center opacity-60 group-hover:scale-[1.02] group-hover:opacity-80 transition-all duration-700 blur-[2px] group-hover:blur-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                                </div>
                                
                                <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                                    <div className="w-12 h-12 mb-6 rounded-full bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 backdrop-blur-md">
                                        <Wand2 className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl text-white mb-4 font-serif">
                                        AI Visuals
                                    </h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        Generate stunning AI-powered graphics and imagery for your event materials.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="parallax-card-up md:mt-24">
                            <div className="reveal bg-[#1A1A1A] border border-white/5 rounded-[32px] p-2 aspect-square flex flex-col justify-start shadow-2xl hover:border-[#FF4500]/50 transition-all duration-500 group overflow-hidden relative" style={{ transitionDelay: "150ms" }}>
                                <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] bg-[#0b0b0b] md:bg-transparent">
                                    <img src={featureCustomDesign} alt="Custom Design" className="w-full h-full object-contain md:object-cover object-center opacity-60 group-hover:scale-[1.02] group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                                </div>
                                
                                <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                                    <div className="w-12 h-12 mb-6 rounded-full bg-[#FF4500] flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-500">
                                       <Palette className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl text-white mb-4 font-serif">
                                        Custom Design
                                    </h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        Full-service creative design tailored to your brand and event requirements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] pointer-events-none"
                     style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
                </div>
            </section>

            <footer className="py-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                        <div className="w-full md:w-auto">
                            <h2 className="text-[10vw] leading-[0.8] tracking-tighter text-white/5 font-bold select-none pointer-events-none uppercase font-serif">
                                Frame Forge.
                            </h2>
                        </div>
                        
                        <div className="flex flex-col gap-8 text-right">
                            <div className="flex flex-col gap-4 text-gray-400">
                                <a href="#" className="hover:text-white transition-colors">Contact</a>
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                            <p className="text-sm text-gray-600">© 2026 Frame Forge. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FrameForgePage;
