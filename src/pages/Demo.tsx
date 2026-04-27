import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Upload,
  User,
  Building,
  Trash2,
  Loader2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { PhoneInput } from "@/components/PhoneInput";

type Gender = "male" | "female";
const BASE_URL = "https://memento.frameforge.one/api";
const REQUEST_OTP_URL = `${BASE_URL}/auth/request-otp`;
const VERIFY_OTP_URL = `${BASE_URL}/auth/verify-otp`;
const GENERATE_URL = `${BASE_URL}/generate`;
const DOWNLOAD_PROXY_URL = `${BASE_URL}/assets/download`;
const GENERATE_API_ORIGIN = new URL(GENERATE_URL).origin;
const DOWNLOAD_API_KEY = (import.meta.env.VITE_DOWNLOAD_API_KEY || "").trim();
const ESTIMATED_GENERATION_SECONDS = 90;

const getApiMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;

  const candidates = [
    (data as Record<string, unknown>).message,
    (data as Record<string, unknown>).error,
    (data as Record<string, unknown>).detail,
    (data as Record<string, unknown>).reason,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return fallback;
};

const isAlreadyRegistered = (status: number, message: string, data: unknown) => {
  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    if (
      record.alreadyRegistered === true ||
      record.alreadyExists === true ||
      record.exists === true
    ) {
      return true;
    }
  }

  if (status === 409) return true;
  return /already\s*(registered|exists|verified|used)|phone\s*(already\s*)?(exists|registered)/i.test(
    message,
  );
};

const isOtpInvalid = (status: number, message: string) => {
  if (status === 400 || status === 422) {
    return /invalid|incorrect|wrong|not\s*valid|mismatch/i.test(message);
  }
  return /invalid|incorrect|wrong|not\s*valid|mismatch/i.test(message);
};

const isOtpExpired = (status: number, message: string) => {
  if (status === 410) return true;
  return /expired|timeout|timed\s*out/i.test(message);
};

export const Demo = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [gender, setGender] = useState<Gender>("male");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(
    ESTIMATED_GENERATION_SECONDS,
  );

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    phone: "",
    otp: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!isGenerating) {
      setSecondsRemaining(ESTIMATED_GENERATION_SECONDS);
      return;
    }

    setSecondsRemaining(ESTIMATED_GENERATION_SECONDS);
    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const next = Math.max(ESTIMATED_GENERATION_SECONDS - elapsedSeconds, 0);
      setSecondsRemaining(next);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  const fetchWithTimeout = async (
    input: RequestInfo | URL,
    init?: RequestInit,
    timeoutMs = 15000,
  ) => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      window.clearTimeout(timer);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const generationProgress =
    ((ESTIMATED_GENERATION_SECONDS - secondsRemaining) /
      ESTIMATED_GENERATION_SECONDS) *
    100;

  const toAbsoluteImageUrl = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return null;
    const raw = value.trim();
    if (/^https?:\/\//i.test(raw)) return raw;

    try {
      return new URL(raw, GENERATE_API_ORIGIN).toString();
    } catch {
      return null;
    }
  };

  const handleSendOtp = async () => {
    const phone = formData.phone.trim();
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

    if (!phone || !phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number (e.g., +919876543210).", { theme: "dark" });
      return;
    }

    setIsSendingOtp(true);
    try {
      // Increased timeout to 30s to allow for slow SMS services
      const response = await fetchWithTimeout(REQUEST_OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      }, 30000);

      const data = await response.json().catch(() => ({}));
      const apiMessage = getApiMessage(data, "Failed to send verification code.");

      // Check if the backend actually sent the SMS even if status is not 200
      const successfullySent = 
        response.ok || 
        data?.success === true || 
        data?.success === "true" || 
        data?.smsSent === true || 
        data?.smsSent === "true" ||
        /sent|success|code/i.test(apiMessage);

      if (isAlreadyRegistered(response.status, apiMessage, data)) {
        toast.info(
          "This phone number has already completed a Frame Forge generation. Please use a different number.",
          { theme: "dark" }
        );
        setIsSendingOtp(false);
        return;
      }

      if (!successfullySent) {
        throw new Error(apiMessage);
      }

      const maybeRequestId = typeof data?.requestId === "string" ? data.requestId : "";
      setFormData((prev) => ({ ...prev, phone }));
      setRequestId(maybeRequestId);
      setIsOtpSent(true);

      const successMessage = /sent|verification\s*code/i.test(apiMessage)
        ? apiMessage
        : "Verification code sent! Your Frame Forge journey begins now.";
      
      toast.success(successMessage, { 
        theme: "dark",
        icon: <ShieldCheck className="w-5 h-5 text-[#FF4500]" />
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.name === "AbortError"
            ? "Request timed out. Please check your signal and try again."
            : error.message
          : "Failed to send verification code. Please try again.";
      toast.error(message, { theme: "dark" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = formData.otp.trim();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit verification code.", { theme: "dark" });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetchWithTimeout(VERIFY_OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          otp,
        }),
      });

      const data = await response.json().catch(() => ({}));

      const apiMessage = getApiMessage(data, "Verification failed.");

      if (!response.ok || !data?.verified) {
        if (isOtpExpired(response.status, apiMessage)) {
          throw new Error("OTP expired. Please request a new code.");
        }

        if (isOtpInvalid(response.status, apiMessage)) {
          throw new Error("Invalid OTP. Please check and try again.");
        }

        throw new Error(apiMessage);
      }

      setRequestId(data?.requestId || requestId);
      setIsOtpVerified(true);
      toast.success(
        /verified|success/i.test(apiMessage)
          ? apiMessage
          : "OTP verified successfully! You can now proceed.",
        { theme: "dark" },
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.name === "AbortError"
            ? "Request timed out. Please try again."
            : error.message
          : "Verification failed.";
      toast.error(message, { theme: "dark" });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
      const fileName = file.name.toLowerCase();
      const hasAllowedExtension = /\.(png|jpe?g)$/.test(fileName);

      if (!allowedMimeTypes.includes(file.type) && !hasAllowedExtension) {
        toast.error("Only PNG, JPG, or JPEG files are allowed.", {
          theme: "dark",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClick = () => {
    if (!isGenerating) setShowUploadModal(true);
  };

  const handleModalOk = () => {
    setShowUploadModal(false);
    fileInputRef.current?.click();
  };

  const handleModalCancel = () => {
    setShowUploadModal(false);
  };

  const handleDownloadPoster = async () => {
    if (!generatedImageUrl) {
      toast.error("No generated image URL found.", { theme: "dark" });
      return;
    }

    setIsDownloading(true);
    try {
      const downloadUrl = new URL(DOWNLOAD_PROXY_URL);
      downloadUrl.searchParams.set("url", generatedImageUrl);
      downloadUrl.searchParams.set("download", "1");
      downloadUrl.searchParams.set("filename", "frameforge-final.png");
      if (DOWNLOAD_API_KEY) {
        downloadUrl.searchParams.set("apiKey", DOWNLOAD_API_KEY);
      }

      const headers: HeadersInit = DOWNLOAD_API_KEY
        ? { "x-download-api-key": DOWNLOAD_API_KEY }
        : {};

      const response = await fetch(downloadUrl.toString(), {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("Download API request failed.");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "frameforge-final.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
      toast.success("Download started! Redirecting to home...", { theme: "dark" });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch {
      toast.error("Download failed. Please try again.", { theme: "dark" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify your phone number first.", { theme: "dark" });
      return;
    }

    if (!formData.name || !formData.organization || !selectedFile) {
      toast.error("Please fill in all fields and upload a photo.", {
        theme: "dark",
      });
      return;
    }

    if (!requestId) {
      toast.error("Missing verification session. Please verify phone number again.", {
        theme: "dark",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const payload = new FormData();
      payload.append("photo", selectedFile);
      payload.append("phone", formData.phone);
      payload.append("requestId", requestId);
      payload.append("name", formData.name);
      payload.append("organization", formData.organization);
      payload.append("gender", gender);

      const response = await fetchWithTimeout(
        GENERATE_URL,
        {
          method: "POST",
          body: payload,
        },
        120000,
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Generation failed.");
      }

      const finalImageUrl =
        toAbsoluteImageUrl(data?.finalImage) ||
        toAbsoluteImageUrl(data?.finalImageUrl) ||
        toAbsoluteImageUrl(data?.generatedImage) ||
        toAbsoluteImageUrl(data?.generatedImageUrl) ||
        null;

      if (!finalImageUrl) {
        throw new Error(
          "Generation completed but no usable image URL was returned by API.",
        );
      }

      setGeneratedImageUrl(finalImageUrl);
      toast.success("Image generation successful!", { theme: "dark" });
      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.name === "AbortError"
            ? "Generation timed out. Please try again."
            : error.message
          : "Generation failed. Please try again.";
      toast.error(message, { theme: "dark" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen">
            <img
              src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024"
              alt="Atmosphere"
              className="w-full h-full object-cover object-center opacity-80"
            />
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border border-[#FF4500]/50 bg-[#FF4500]/10 flex items-center justify-center mb-8 mx-auto text-[#FF4500]">
            <ImageIcon className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#ffe0e0] mb-6 tracking-tight">
            AI Poster Ready.
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mb-12">
            Your personalized event poster has been generated. You can now
            download it and share your future self.
          </p>

          <div className="mb-12 relative group max-w-md w-full aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0b0b]">
            {!generatedImageUrl && (
              <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#FF4500]/20" />
              </div>
            )}
            <img
              src={generatedImageUrl || ""}
              alt="Generated Poster"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-left">
              <p className="text-[#FF4500] font-bold tracking-widest text-xs uppercase mb-2">
                Scaleup Conclave 2026
              </p>
              <h3 className="text-3xl font-bold text-white uppercase">
                {formData.name}
              </h3>
              <p className="text-white/60 text-sm mt-1">
                {formData.organization}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleDownloadPoster}
              disabled={!generatedImageUrl || isDownloading}
              className="px-8 py-4 bg-[#FF4500] text-white rounded-full font-bold hover:bg-[#FF5510] transition-all active:scale-95 text-base flex items-center gap-2 disabled:opacity-60 shadow-lg shadow-[#FF4500]/20"
            >
              {isDownloading ? (
                <>
                  Downloading... <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  Download Poster <Upload className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.location.href = "/"}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all active:scale-95 text-base flex items-center gap-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#050505]">
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden pt-40 pb-10">
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
            <img
              src="/logo_white.png"
              alt="Frame Forge Logo"
              className="h-8 md:h-10 w-auto mx-auto mb-8 opacity-95"
            />
            <h1
              className="text-5xl md:text-8xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif"
              style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
            >
              AI Persona.
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: "200ms" }}>
            <p
              className="text-base md:text-xl text-[#ffe0e0]/90 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mix-blend-overlay"
              style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
            >
              Transform into your vision. Our AI generates a cinematic superhero
              portrait tailored to your professional identity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <AnimatePresence mode="wait">
            {!isOtpVerified ? (
              <motion.div
                key="verification-phase"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl mx-auto px-1"
              >
                <div className="bg-[#111] p-6 sm:p-8 md:p-14 rounded-[30px] md:rounded-[40px] border border-white/5 shadow-2xl space-y-7 relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF4500]/50 to-transparent"></div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:border-[#FF4500]/30 transition-colors">
                      <ShieldCheck className="w-8 h-8 text-[#FF4500]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-tight">
                      Identity Verification
                    </h2>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      Please verify your mobile number to access the identity-preserving
                      demo.
                    </p>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                        Mobile Number
                      </label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                        disabled={isOtpSent}
                        placeholder="Enter mobile number"
                      />
                    </div>

                    {!isOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="w-full bg-white text-black font-bold uppercase tracking-[0.15em] sm:tracking-widest py-4 sm:py-5 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group/btn text-xs sm:text-sm"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Send Verification Code{" "}
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col gap-2 relative">
                          <label className="text-xs uppercase tracking-widest text-[#FF4500] ml-4 font-bold">
                            Verification Code
                          </label>
                          <div className="relative">
                            <input
                              name="otp"
                              value={formData.otp}
                              onChange={handleInputChange}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className="w-full bg-white/5 border border-[#FF4500]/40 rounded-full px-5 sm:px-6 py-4 sm:py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500] transition-colors pl-10 sm:pl-14 tracking-[0.35em] sm:tracking-[1em] font-bold text-center text-sm sm:text-base"
                            />
                            <ShieldCheck className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#FF4500]" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp}
                          className="w-full bg-[#FF4500] text-white font-bold uppercase tracking-[0.15em] sm:tracking-widest py-4 sm:py-5 rounded-full hover:bg-[#FF5510] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF4500]/20 text-xs sm:text-sm"
                        >
                          {isVerifyingOtp ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Verify Identity <Check className="w-5 h-5" />
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtpSent(false);
                            setIsOtpVerified(false);
                            setRequestId("");
                            setFormData((prev) => ({ ...prev, otp: "" }));
                          }}
                          className="w-full text-[11px] text-gray-500 uppercase tracking-[0.14em] sm:tracking-widest hover:text-white transition-colors"
                        >
                          Change Mobile Number
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                  <div className="bg-[#111] p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl space-y-10 relative h-full">
                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-0.5">
                            Verified Access
                          </p>
                          <p className="text-white text-xs font-medium">
                            {formData.phone}
                          </p>
                        </div>
                      </div>
                      <Sparkles className="w-5 h-5 text-[#FF4500] animate-pulse" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isGenerating}
                            placeholder="e.g. MOHANLAL"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors pl-14 disabled:opacity-60"
                          />
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 relative">
                        <label className="text-xs uppercase tracking-widest text-gray-500 ml-4 font-semibold">
                          Organization *
                        </label>
                        <div className="relative">
                          <input
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            disabled={isGenerating}
                            placeholder="e.g. Acme Tech"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FF4500]/50 transition-colors pl-14 disabled:opacity-60"
                          />
                          <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center ml-4">
                          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                            Persona Style *
                          </label>
                          <span className="text-[10px] text-[#FF4500]/70 font-semibold uppercase tracking-tighter italic">
                            Note: Image generation on persons only
                          </span>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                          {(["male", "female"] as Gender[]).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setGender(option)}
                              disabled={isGenerating}
                              className={`flex-1 py-4 px-4 rounded-xl text-sm font-bold transition-all uppercase tracking-wider ${
                                gender === option
                                  ? "bg-white text-black shadow-lg scale-[1.02]"
                                  : "text-gray-500 hover:text-white"
                              } disabled:opacity-60`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-3 bg-[#FF4500] text-white font-bold uppercase tracking-[0.2em] rounded-full py-6 mt-8 hover:bg-[#FF5510] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-[#FF4500]/20 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />{" "}
                            Sculpting Persona...
                          </>
                        ) : (
                          <>
                            Generate AI Portrait{" "}
                            <Sparkles className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {isGenerating && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35 }}
                            className="mt-6 rounded-2xl border border-[#FF4500]/20 bg-[#FF4500]/5 p-5"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs uppercase tracking-widest text-[#FF4500] font-bold">
                                Estimated Generation Time
                              </p>
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm font-mono text-white font-bold"
                              >
                                {formatCountdown(secondsRemaining)}
                              </motion.p>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${generationProgress}%` }}
                                transition={{ ease: "linear" }}
                                className="h-full bg-[#FF4500] shadow-[0_0_15px_rgba(255,69,0,0.5)]"
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-3 text-center uppercase tracking-[0.15em] font-medium animate-pulse">
                              Our AI is weaving your digital destiny...
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="lg:sticky lg:top-32 h-full">
                    <div className="bg-[#111] p-8 md:p-10 rounded-[40px] border border-white/5 shadow-2xl flex flex-col items-center text-center h-full">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-8">
                        Portrait Upload
                      </label>

                      <div
                        onClick={handleUploadClick}
                        className={`relative w-full aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 overflow-hidden group
                          ${imagePreview ? "border-[#FF4500]/40" : "border-white/10 hover:border-white/30 bg-white/[0.02]"}
                          ${isGenerating ? "pointer-events-none opacity-60" : ""}`}
                      >
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Upload Preview"
                              className="absolute inset-0 w-full h-full object-contain object-center bg-[#0b0b0b]"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <Upload className="w-8 h-8 text-white" />
                              <span className="text-white text-xs font-bold uppercase tracking-widest">
                                Change Photo
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <div className="space-y-1 px-6">
                              <p className="text-white font-medium">
                                Click to upload portrait
                              </p>
                              <p className="text-gray-500 text-xs leading-relaxed italic">
                                Upload a clear photo for 100% identity preservation
                              </p>
                            </div>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                          disabled={isGenerating}
                          className="hidden"
                        />
                      </div>

                      <AnimatePresence>
                        {showUploadModal && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-default"
                          >
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.95, opacity: 0 }}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl p-8 sm:p-10 font-sans text-left"
                            >
                              <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-tight mb-4">Upload Guidelines</h3>
                              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                You only have one generation, so please use a high-quality photo with proper lighting and direct angles for the best result.
                              </p>
                              <div className="relative rounded-2xl overflow-hidden border border-white/5 mb-8">
                                <img
                                  src="/Image to use.webp"
                                  alt="Guidelines Example"
                                  className="w-full h-auto object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              </div>
                              <div className="flex justify-end gap-3">
                                <button
                                  type="button"
                                  onClick={handleModalCancel}
                                  className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white transition uppercase text-xs font-bold tracking-widest"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={handleModalOk}
                                  className="px-10 py-3 rounded-full bg-[#FF4500] text-white font-bold hover:bg-[#FF5510] transition uppercase text-xs tracking-widest"
                                >
                                  OK, Continue
                                </button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={isGenerating}
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
                            <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">
                              Identity Preservation
                            </p>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                              Your facial features are mirrored with exact precision. Our AI only enhances the cinematic landscape around your true self.
                            </p>
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
    </div>
  );
};
