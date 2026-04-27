import React, { useState } from "react";
import { Send, Check, Minus, Plus, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

const servicesOptions = [
  { id: "frames", label: "AI Event Frames" },
  { id: "badges", label: "Smart Event Badges" },
  { id: "aiVisuals", label: "AI Image Generation" },
  { id: "customDesign", label: "Custom Creative Design" },
  { id: "integration", label: "Ticketing Integration" },
];

export const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    eventName: "",
    eventDate: "",
    attendees: 500,
    email: "",
    phone: "",
    details: "",
    services: {
      frames: false,
      badges: false,
      aiVisuals: false,
      customDesign: false,
      integration: false,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: !prev.services[serviceId as keyof typeof prev.services],
      },
    }));
  };

  const handleAttendees = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      attendees: Math.max(0, prev.attendees + delta),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.organization.trim())
      newErrors.organization = "Organization is required";
    if (!formData.eventName.trim())
      newErrors.eventName = "Event Name is required";
    if (!formData.eventDate.trim())
      newErrors.eventDate = "Event Date is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length < 8) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.", {
        theme: "dark",
      });
      return;
    }

    setIsSending(true);

    const selectedServices = Object.entries(formData.services)
      .filter(([_, selected]) => selected)
      .map(([id, _]) => servicesOptions.find((s) => s.id === id)?.label || id);

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formattedDate = formData.eventDate.split("-").reverse().join("/");

    try {
      const { data: response, error } = await supabase.functions.invoke(
        "send-contact-enquiry",
        {
          body: {
            name: formData.name,
            organization: formData.organization,
            eventName: formData.eventName,
            eventDate: formattedDate,
            expectedAttendees: formData.attendees.toString(),
            email: formData.email,
            phone: formData.phone,
            message: formData.details,
            selectedServices,
          },
        },
      );

      if (error) throw error;
      if (response?.error) throw new Error(response.error);

      toast.success("Enquiry sent! We will respond within 24 hrs.", {
        theme: "dark",
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit contact enquiry:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send enquiry. Please try again.",
        { theme: "dark" },
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
        {/* ... (Success State Background Stays Same) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
            <img
              src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024"
              alt="Atmosphere"
              className="w-full h-full object-cover object-center opacity-80"
              loading="lazy"
            />
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border border-[#FF4500]/50 bg-[#FF4500]/10 flex items-center justify-center mb-8 mx-auto text-[#FF4500]">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#ffe0e0] mb-6">
            Enquiry Sent.
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mb-12">
            Thank you for reaching out. A WhatsApp confirmation has been
            initiated. We will respond within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all active:scale-95 text-base"
          >
            Submit Another Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-40 pb-10 bg-[#050505]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
            <img
              src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024"
              alt="Atmosphere"
              className="w-full h-full object-cover object-center opacity-80"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <div className="reveal">
            <h1
              className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif"
              style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
            >
              Let's Connect.
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: "200ms" }}>
            <p
              className="text-base md:text-lg text-[#ffe0e0]/90 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mix-blend-overlay"
              style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
            >
              Ready to transform your event? Fill out the form below and our
              team will reach out within 24 hours to discuss your needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto reveal mt-12 bg-[#111] p-10 py-16 md:p-16 rounded-[40px] border border-white/5 shadow-2xl">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 flex flex-col no-validate"
              noValidate
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className={`bg-white/5 border ${errors.name ? "border-red-500/50" : "border-white/10"} rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors`}
                  />
                  {errors.name && (
                    <span className="absolute -bottom-6 left-6 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Organization *
                  </label>
                  <input
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    className={`bg-white/5 border ${errors.organization ? "border-red-500/50" : "border-white/10"} rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors`}
                  />
                  {errors.organization && (
                    <span className="absolute -bottom-6 left-6 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.organization}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Event Name *
                  </label>
                  <input
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Annual Tech Summit 2025"
                    className={`bg-white/5 border ${errors.eventName ? "border-red-500/50" : "border-white/10"} rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors`}
                  />
                  {errors.eventName && (
                    <span className="absolute -bottom-6 left-6 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.eventName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Event Date *
                  </label>
                  <input
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={`bg-white/5 border ${errors.eventDate ? "border-red-500/50" : "border-white/10"} rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors [color-scheme:dark]`}
                  />
                  {errors.eventDate && (
                    <span className="absolute -bottom-6 left-6 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.eventDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Expected Attendees
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-[56px] sm:h-[60px] overflow-hidden group focus-within:border-[#FF4500]/50 transition-colors px-1 sm:px-2">
                    <button
                      type="button"
                      onClick={() => handleAttendees(-50)}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      name="attendees"
                      value={formData.attendees}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFormData((prev) => ({
                          ...prev,
                          attendees: val === "" ? 0 : parseInt(val),
                        }));
                      }}
                      className="flex-1 min-w-0 bg-transparent text-center text-base sm:text-lg font-medium text-white tabular-nums focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAttendees(50)}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Services interested in */}
              <div className="flex flex-col gap-4">
                <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                  Services Interested In
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-4">
                  {servicesOptions.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        onClick={() => handleServiceToggle(service.id)}
                        className={`w-5 h-5 rounded border ${formData.services[service.id as keyof typeof formData.services] ? "bg-[#FF4500] border-[#FF4500]" : "border-white/20"} flex items-center justify-center transition-all`}
                      >
                        {formData.services[
                          service.id as keyof typeof formData.services
                        ] && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                        {service.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Email *
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@acme.com"
                    className={`bg-white/5 border ${errors.email ? "border-red-500/50" : "border-white/10"} rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors`}
                  />
                  {errors.email && (
                    <span className="absolute -bottom-6 left-6 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`bg-white/5 border ${errors.phone ? "border-red-500/50" : "border-white/10"} rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors`}
                  />
                  {errors.phone && (
                    <span className="absolute -bottom-6 left-6 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                  Additional Details
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us more about your event and requirements..."
                  className="bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-8 pb-4">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold uppercase tracking-widest rounded-full py-5 hover:bg-gray-200 transition-colors active:scale-95 shadow-lg shadow-white/5 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      Sending... <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* Background Pattern */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto reveal">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                Follow Us
              </p>
              <div className="flex items-center gap-6">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/frameforgeone/"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-ig-link"
                  className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-[#FF4500]/40 hover:bg-[#FF4500]/5 transition-all duration-300 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  <span className="text-sm font-medium">@frameforgeone</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61587792958879"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-fb-link"
                  className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-[#FF4500]/40 hover:bg-[#FF4500]/5 transition-all duration-300 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="text-sm font-medium">Frame Forge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
