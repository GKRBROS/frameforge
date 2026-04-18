import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Upload, User, Building, Trash2, Loader2, Sparkles, Mail, ShieldCheck, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { PROMPTS, GenderOption } from '../lib/prompts';

type Gender = 'male' | 'female';

export const Demo = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [gender, setGender] = useState<Gender>('male');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        otp: ''
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Simulated check for existing users
    const [usedEmails, setUsedEmails] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('demo_used_emails');
        if (stored) setUsedEmails(JSON.parse(stored));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async () => {
        if (!formData.email || !formData.email.includes('@')) {
            toast.error("Please enter a valid email address.", { theme: "dark" });
            return;
        }

        if (usedEmails.includes(formData.email)) {
            toast.warning("This email has already been used for a demo poster.", { theme: "dark" });
            return;
        }

        setIsSendingOtp(true);
        // Simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsOtpSent(true);
        setIsSendingOtp(false);
        toast.info("Verification code sent to your email!", { theme: "dark" });
    };

    const handleVerifyOtp = async () => {
        if (formData.otp.length < 4) {
            toast.error("Please enter the full verification code.", { theme: "dark" });
            return;
        }

        setIsVerifyingOtp(true);
        // Simulate OTP verification (hardcoded "1234" for demo)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (formData.otp === "1234") {
            setIsOtpVerified(true);
            setIsVerifyingOtp(false);
            toast.success("Email verified! You can now proceed.", { theme: "dark" });
            
            // Mark email as used
            const newUsed = [...usedEmails, formData.email];
            setUsedEmails(newUsed);
            localStorage.setItem('demo_used_emails', JSON.stringify(newUsed));
        } else {
            setIsVerifyingOtp(false);
            toast.error("Invalid verification code. Use 1234 for this demo.", { theme: "dark" });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size too large. Max 5MB.", { theme: "dark" });
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isOtpVerified) {
            toast.error("Please verify your email first.", { theme: "dark" });
            return;
        }

        if (!formData.name || !formData.organization || !selectedFile) {
            toast.error("Please fill in all fields and upload a photo.", { theme: "dark" });
            return;
        }

        setIsGenerating(true);
        
        // Simulating API implementation with the imported prompt
        try {
            const payload = {
                name: formData.name,
                organization: formData.organization,
                gender: gender,
                systemPrompt: PROMPTS[gender as GenderOption], // Integrated prompt from prompts.ts
                email: formData.email
            };
            
            console.log("Sending Generation Request:", payload);
            
            await new Promise(resolve => setTimeout(resolve, 4000));
            toast.success("Image generation successful!", { theme: "dark" });
            setIsSubmitted(true);
        } catch (error) {
            toast.error("Generation failed. Please try again.", { theme: "dark" });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
                        <img src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024" alt="Atmosphere" className="w-full h-full object-cover object-center opacity-80" />
                    </div>
                </div>
                <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border border-[#FF4500]/50 bg-[#FF4500]/10 flex items-center justify-center mb-8 mx-auto text-[#FF4500]">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-[#ffe0e0] mb-6 tracking-tight">AI Poster Ready.</h1>
                    <p className="text-xl text-gray-500 max-w-lg mb-12">Your personalized event poster has been generated. You can now download it and share your future self.</p>
                    
                    <div className="mb-12 relative group max-w-md w-full aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0b0b]">
                         {/* Placeholder for generated image */}
                        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                             <Sparkles className="w-12 h-12 text-[#FF4500]/20" />
                        </div>
                        <img src={imagePreview || ''} alt="Generated Poster" className="w-full h-full object-contain object-center opacity-70 grayscale mix-blend-luminosity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-left">
                            <p className="text-[#FF4500] font-bold tracking-widest text-xs uppercase mb-2">Scaleup Conclave 2026</p>
                            <h3 className="text-3xl font-bold text-white uppercase">{formData.name}</h3>
                            <p className="text-white/60 text-sm mt-1">{formData.organization}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center gap-2">
                            Download Poster <Upload className="w-4 h-4 rotate-180" />
                        </button>
                        <button onClick={() => setIsSubmitted(false)} className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all active:scale-95 text-base">
                            Create Another
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <div className="bg-[#050505]">
            <section className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden pt-40 pb-10">
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
                        <img src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024" alt="Atmosphere" className="w-full h-full object-cover object-center opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <div className="reveal">
                        <h1 className="text-5xl md:text-8xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif" style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            AI Persona.
                        </h1>
                    </div>
                    <div className="reveal" style={{ transitionDelay: "200ms" }}>
                        <p className="text-base md:text-xl text-[#ffe0e0]/90 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mix-blend-overlay" style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}>
                            Transform into your vision. Our AI generates a cinematic superhero portrait tailored to your professional identity.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <AnimatePresence mode="wait">
                        {!isOtpVerified ? (
                            <motion.div 
                                key="verification-phase"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-xl mx-auto"
                            >
                                <div className="bg-[#111] p-10 md:p-14 rounded-[40px] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF4500]/50 to-transparent"></div>
                                    
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:border-[#FF4500]/30 transition-colors">
                                            <ShieldCheck className="w-8 h-8 text-[#FF4500]" />
                                        </div>
                                        <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Identity Verification</h2>
                                        <p className="text-gray-500 text-sm max-w-xs mx-auto">Please verify your email to access the identity-preserving demo.</p>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">Email Address</label>
                                            <div className="relative">
                                                <input 
                                                    name="email" 
                                                    type="email"
                                                    value={formData.email} 
                                                    onChange={handleInputChange} 
                                                    disabled={isOtpSent}
                                                    placeholder="Enter your email" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors pl-14 disabled:opacity-50" 
                                                />
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                            </div>
                                        </div>

                                        {!isOtpSent ? (
                                            <button 
                                                onClick={handleSendOtp}
                                                disabled={isSendingOtp}
                                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-5 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                {isSendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Verification Code <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
                                            </button>
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-6"
                                            >
                                                <div className="flex flex-col gap-2 relative">
                                                    <label className="text-xs uppercase tracking-widest text-[#FF4500] ml-4 font-bold">Verification Code</label>
                                                    <div className="relative">
                                                        <input 
                                                            name="otp" 
                                                            value={formData.otp} 
                                                            onChange={handleInputChange} 
                                                            placeholder="Enter 1234" 
                                                            maxLength={4}
                                                            className="w-full bg-white/5 border border-[#FF4500]/40 rounded-full px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500] transition-colors pl-14 tracking-[1em] font-bold text-center" 
                                                        />
                                                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4500]" />
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={handleVerifyOtp}
                                                    disabled={isVerifyingOtp}
                                                    className="w-full bg-[#FF4500] text-white font-bold uppercase tracking-widest py-5 rounded-full hover:bg-[#FF5510] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF4500]/20"
                                                >
                                                    {isVerifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify Identity <Check className="w-5 h-5" /></>}
                                                </button>
                                                <button 
                                                    onClick={() => setIsOtpSent(false)} 
                                                    className="w-full text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                                                >
                                                    Change Email Address
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="form-phase"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="max-w-6xl mx-auto"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                    <div className="bg-[#111] p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl space-y-10 relative">
                                        <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-0.5">Verified Access</p>
                                                    <p className="text-white text-xs font-medium">{formData.email}</p>
                                                </div>
                                            </div>
                                            <Sparkles className="w-5 h-5 text-[#FF4500] animate-pulse" />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-2 relative">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">Full Name *</label>
                                                <div className="relative">
                                                    <input 
                                                        name="name" 
                                                        value={formData.name} 
                                                        onChange={handleInputChange} 
                                                        placeholder="e.g. MOHANLAL" 
                                                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors pl-14" 
                                                    />
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 relative">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">Organization *</label>
                                                <div className="relative">
                                                    <input 
                                                        name="organization" 
                                                        value={formData.organization} 
                                                        onChange={handleInputChange} 
                                                        placeholder="e.g. Acme Tech" 
                                                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors pl-14" 
                                                    />
                                                    <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center ml-4">
                                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Persona Style *</label>
                                                    <span className="text-[10px] text-[#FF4500]/70 font-semibold uppercase tracking-tighter italic">Note: Image generation on persons only</span>
                                                </div>
                                                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                                                    {(['male', 'female'] as Gender[]).map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => setGender(option)}
                                                            className={`flex-1 py-4 px-4 rounded-xl text-sm font-bold transition-all uppercase tracking-wider ${
                                                                gender === option 
                                                                ? 'bg-white text-black shadow-lg scale-[1.02]' 
                                                                : 'text-gray-500 hover:text-white'
                                                            }`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleSubmit}
                                                disabled={isGenerating}
                                                className="w-full flex items-center justify-center gap-3 bg-[#FF4500] text-white font-bold uppercase tracking-[0.2em] rounded-full py-6 mt-8 hover:bg-[#FF5510] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-[#FF4500]/20 disabled:opacity-50"
                                            >
                                                {isGenerating ? (
                                                    <><Loader2 className="w-6 h-6 animate-spin" /> Sculpting Persona...</>
                                                ) : (
                                                    <>Generate AI Portrait <Sparkles className="w-5 h-5" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="reveal lg:sticky lg:top-32" style={{ transitionDelay: "150ms" }}>
                                        <div className="bg-[#111] p-8 md:p-10 rounded-[40px] border border-white/5 shadow-2xl flex flex-col items-center text-center">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-8">Portrait Upload</label>
                                            
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative w-full aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 overflow-hidden group
                                                    ${imagePreview ? 'border-[#FF4500]/40' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}
                                            >
                                                {imagePreview ? (
                                                    <>
                                                        <img src={imagePreview} alt="Upload Preview" className="absolute inset-0 w-full h-full object-contain object-center bg-[#0b0b0b]" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                            <Upload className="w-8 h-8 text-white" />
                                                            <span className="text-white text-xs font-bold uppercase tracking-widest">Change Photo</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
                                                        </div>
                                                        <div className="space-y-1 px-6">
                                                            <p className="text-white font-medium">Click to upload portrait</p>
                                                            <p className="text-gray-500 text-xs leading-relaxed italic">Upload a clear photo for 100% identity preservation</p>
                                                        </div>
                                                    </>
                                                )}
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    onChange={handleImageUpload} 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                />
                                            </div>

                                            {imagePreview && (
                                                <button 
                                                    onClick={handleRemoveImage}
                                                    className="mt-6 flex items-center gap-2 text-xs text-red-500/60 hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Remove Photo
                                                </button>
                                            )}

                                            <div className="mt-10 p-6 rounded-2xl bg-[#FF4500]/5 border border-[#FF4500]/10 text-left w-full">
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-10 h-10 rounded-full bg-[#FF4500] flex items-center justify-center shrink-0">
                                                        <Sparkles className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Identity Preservation</p>
                                                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Your facial features are mirrored with exact precision. Our AI only enhances the cinematic landscape around your true self.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Background Pattern */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] pointer-events-none"
                         style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                    </div>
                </div>
            </section>
        </div>
    );
};
