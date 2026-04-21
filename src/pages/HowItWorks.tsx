import React from 'react';
import { UserPlus, Link2, Upload, Sparkles, Share2 } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register",
    description: "Set up your event in Frame Forge by providing basic details like event name, date, branding assets, and design preferences.",
    image: "/showcase-speaker-frame.png"
  },
  {
    number: "02",
    icon: Link2,
    title: "Integrate",
    description: "Connect Frame Forge to your event using our flexible options: API, embeddable link, or custom website snippet.",
    image: "/showcase-attendee-badge.png"
  },
  {
    number: "03",
    icon: Upload,
    title: "Upload",
    description: "Through your chosen integration, attendees easily upload their photos. Mobile-friendly and no app downloads required.",
    image: "/Frame 2087326593.png"
  },
  {
    number: "04",
    icon: Sparkles,
    title: "AI Magic",
    description: "Our AI instantly processes the photo, applying your custom frame design and generating any visual elements you configured.",
    image: "/sample-frame-1.jpg"
  },
  {
    number: "05",
    icon: Share2,
    title: "Amplify",
    description: "Attendees receive their branded photo ready to share on social media. Every share extends your event's reach organically.",
    image: "/Instagram story mockup.png"
  },
];

export const HowItWorks = () => {
    return (
        <div className="bg-[#050505] text-white">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
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
                        <h1 className="text-5xl md:text-8xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif" 
                            style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            How It Works. <br />
                        </h1>
                    </div>
                    <div className="reveal" style={{ transitionDelay: "200ms" }}>
                        <p className="text-base md:text-xl text-[#ffe0e0]/90 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mix-blend-overlay"
                           style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            From event setup to viral sharing, see how Frame Forge transforms your attendee experience in five simple, elegant steps.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Timeline in Negative Space Aesthetic */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                    {steps.map((step, index) => (
                        <div key={index} className={`reveal mb-40 flex flex-col md:flex-row items-center gap-12 md:gap-24 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                            
                            <div className="flex-1 space-y-8">
                                <div className={`flex items-center gap-6 opacity-50 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                    <span className="font-serif text-3xl italic">{step.number}</span>
                                    <div className="w-12 h-px bg-white/50"></div>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                
                                <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter leading-none">
                                    {step.title}.
                                </h2>
                                
                                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light max-w-xl">
                                    {step.description}
                                </p>
                            </div>

                            <div className="flex-1 relative group w-full max-w-xl md:max-w-none">
                                <div className="absolute -inset-4 bg-[#FF4500]/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#111]">
                                    <img
                                        src={step.image}
                                        alt=""
                                        aria-hidden="true"
                                        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 scale-110 blur-xl"
                                    />
                                    <img 
                                        src={step.image} 
                                        alt={step.title} 
                                        className="relative z-10 block w-full h-auto max-h-[75vh] object-contain object-center transform transition-transform duration-700 group-hover:scale-[1.02] p-2 sm:p-3"
                                    />
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                
                {/* Background Pattern */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-5 pointer-events-none"
                     style={{ backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
                </div>
            </section>
        </div>
    );
};
