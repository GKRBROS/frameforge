import React from 'react';
import { Code, Globe, Plug, Zap } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const integrations = [
  {
    id: "api",
    icon: Code,
    title: "API",
    description: "Our RESTful API gives you complete programmatic control over Frame Forge. Build custom experiences, automate workflows, and integrate deeply with your existing systems.",
    features: ["REST endpoints", "Webhooks", "API keys", "Rate limits"],
    codeSnippet: `const response = await fetch('https://api.frameforge.one/v1/frames', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_id: 'evt_123',
    photo_url: 'https://example.com/photo.jpg',
    template_id: 'tmpl_456'
  })
});`
  },
  {
    id: "link",
    icon: Globe,
    title: "Link",
    description: "The simplest way to get started. Generate a unique link for your event that you can share anywhere. No coding required.",
    features: ["Setup in 5 min", "Any device", "Branded landing", "Analytics"],
    codeSnippet: `// Your generated share link
https://frames.frameforge.one/your-event-name`
  },
  {
    id: "embed",
    icon: Plug,
    title: "Embed",
    description: "Embed Frame Forge directly into your event website for a seamless user experience. A simple code snippet is all you need.",
    features: ["One-line embed", "Responsive", "Custom CSS", "Lazy loading"],
    codeSnippet: `<div id="frameforge-widget"></div>
<script src="https://cdn.frameforge.one/widget.js"></script>
<script>
  Frameforge.init({
    eventId: 'your-event-id',
    container: '#frameforge-widget',
    theme: 'dark'
  });
</script>`
  }
];

export const Integration = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
                        <img src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024" alt="Atmosphere" className="w-full h-full object-cover object-center opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center">
                    <div className="reveal">
                        <h1 className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif" 
                            style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            Seamless <br />Integration.
                        </h1>
                    </div>
                    <div className="reveal" style={{ transitionDelay: "200ms" }}>
                        <p className="text-base md:text-lg text-[#ffe0e0]/90 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mix-blend-overlay"
                           style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            Connect Frame Forge to your existing infrastructure with flexible options. From simple links to full API access.
                        </p>
                    </div>
                </div>
            </section>

            {/* Integration Panels */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col gap-32 max-w-5xl mx-auto">
                        {integrations.map((integration, index) => (
                            <div key={index} className="reveal flex flex-col lg:flex-row gap-16 items-center">
                                {/* Details */}
                                <div className={`flex-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80">
                                            <integration.icon className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-serif text-white">{integration.title}</h2>
                                    </div>
                                    <p className="text-lg text-gray-400 mb-8 font-light leading-relaxed">
                                        {integration.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {integration.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-500 uppercase tracking-widest font-mono">
                                                <Zap className="w-3 h-3 text-[#FF4500]" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Code Snippet / Technical Side */}
                                <div className={`flex-1 w-full ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl shadow-xl">
                                        <div className="flex gap-2 mb-6">
                                            <div className="w-3 h-3 rounded-full bg-white/20" />
                                            <div className="w-3 h-3 rounded-full bg-white/20" />
                                            <div className="w-3 h-3 rounded-full bg-white/20" />
                                        </div>
                                        <pre className="text-xs md:text-sm text-gray-400 font-mono overflow-x-auto">
                                            <code>{integration.codeSnippet}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
};
