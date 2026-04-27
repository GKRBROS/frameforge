import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Mail, RotateCcw, LogOut, UserPlus, Trash2, Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import { PhoneInput } from "@/components/PhoneInput";
import { adminApi } from "@/lib/adminApi";

const REQUEST_OTP_URL = "https://memento.frameforge.one/api/auth/request-otp";
const VERIFY_OTP_URL = "https://memento.frameforge.one/api/auth/verify-otp";
const RESET_GENERATE_URL = "https://memento.frameforge.one/api/generate/reset";


const PRIMARY_ADMIN_EMAILS = [
  "frameforgeone@gmail.com",
  "jheroson0@gmail.com",
];

const ALLOWLIST_STORAGE_KEY = "frameforge.admin.allowedEmails";
const SESSION_STORAGE_KEY = "frameforge.admin.session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type AdminSession = {
  email: string;
  verifiedAt: number;
};

const readAllowlist = () => {
  try {
    const raw = localStorage.getItem(ALLOWLIST_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    const normalized = parsed
      .map((email) => normalizeEmail(email))
      .filter((email) => isValidEmail(email));

    // Always include both primary admin emails
    for (const adminEmail of PRIMARY_ADMIN_EMAILS) {
      if (isValidEmail(adminEmail)) {
        normalized.push(normalizeEmail(adminEmail));
      }
    }

    return Array.from(new Set(normalized));
  } catch {
    return PRIMARY_ADMIN_EMAILS.filter(isValidEmail).map(normalizeEmail);
  }
};

const writeAllowlist = (emails: string[]) => {
  localStorage.setItem(ALLOWLIST_STORAGE_KEY, JSON.stringify(emails));
};

const readSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.email || !parsed?.verifiedAt) {
      return null;
    }

    if (Date.now() - parsed.verifiedAt > SESSION_TTL_MS) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return {
      email: normalizeEmail(parsed.email),
      verifiedAt: parsed.verifiedAt,
    };
  } catch {
    return null;
  }
};

const writeSession = (session: AdminSession) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

const getApiMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;
  const bag = data as Record<string, unknown>;

  const candidates = [bag.message, bag.error, bag.detail, bag.reason];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return fallback;
};

export const AdminDashboard = () => {
  const [allowlist, setAllowlist] = useState<string[]>([]);
  const [session, setSession] = useState<AdminSession | null>(null);

  const [authPhone, setAuthPhone] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [newAllowedEmail, setNewAllowedEmail] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [targetRequestId, setTargetRequestId] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const emails = readAllowlist();
    writeAllowlist(emails);
    setAllowlist(emails);

    const existingSession = readSession();
    if (!existingSession) return;

    if (emails.includes(existingSession.email)) {
      setSession(existingSession);
      setAuthPhone(existingSession.email); // Keep email for session if that's what's stored, or update to phone
      return;
    }

    clearSession();
  }, []);

  const isEmailAllowed = (email: string) => {
    const normalized = normalizeEmail(email);
    return allowlist.includes(normalized);
  };



  const handleSendOtp = async () => {
    if (!authPhone || authPhone.length < 10) {
      toast.error("Enter a valid admin phone number.", { theme: "dark" });
      return;
    }

    // Note: We might want to check if the phone is allowed, 
    // but the current allowlist logic uses emails. 
    // For now, we'll proceed as the user requested "the number".

    setIsSendingOtp(true);
    try {
      const response = await adminApi.requestOtp(authPhone);

      if (!response.success) {
        throw new Error(response.error || "Failed to send OTP.");
      }

      setRequestId(response.requestId || "");
      setIsOtpSent(true);
      const successMessage = response.data?.smsSent 
        ? "OTP sent successfully to your phone." 
        : "OTP has been sent.";
      toast.info(successMessage, { theme: "dark" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send OTP.";
      toast.error(message, { theme: "dark" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const email = normalizeEmail(authEmail);
    const otp = authOtp.trim();

    if (!isValidEmail(email)) {
      toast.error("Enter a valid admin email.", { theme: "dark" });
      return;
    }

    if (!isEmailAllowed(email)) {
      toast.error("This email is not allowed to access the admin dashboard.", {
        theme: "dark",
      });
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit OTP code.", { theme: "dark" });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await adminApi.verifyOtp(authPhone, otp);

      if (!response.success || !response.data?.verified) {
        throw new Error(response.error || "OTP verification failed.");
      }

      setRequestId(response.requestId || requestId);
      const nextSession: AdminSession = {
        email: authPhone, // Using phone as identifier for session
        verifiedAt: Date.now(),
      };

      setRequestId(typeof data?.requestId === "string" ? data.requestId : requestId);
      setSession(nextSession);
      setAuthOtp("");
      writeSession(nextSession);
      toast.success("Admin OTP verified. Access granted.", { theme: "dark" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "OTP verification failed.";
      toast.error(message, { theme: "dark" });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleAddAllowedEmail = () => {
    const email = normalizeEmail(newAllowedEmail);

    if (!isValidEmail(email)) {
      toast.error("Enter a valid email to add.", { theme: "dark" });
      return;
    }

    if (allowlist.includes(email)) {
      toast.info("Email already exists in allowlist.", { theme: "dark" });
      return;
    }

    const next = [...allowlist, email];
    setAllowlist(next);
    writeAllowlist(next);
    setNewAllowedEmail("");
    toast.success("Allowed admin email added.", { theme: "dark" });
  };

  const handleRemoveAllowedEmail = (email: string) => {
    if (PRIMARY_ADMIN_EMAILS.map(normalizeEmail).includes(email)) {
      toast.error("Primary admin email cannot be removed.", { theme: "dark" });
      return;
    }

    if (session?.email === email) {
      toast.error("You cannot remove your currently logged-in email.", {
        theme: "dark",
      });
      return;
    }

    const next = allowlist.filter((item) => item !== email);
    setAllowlist(next);
    writeAllowlist(next);
    toast.info("Allowed admin email removed.", { theme: "dark" });
  };

  const handleResetGeneration = async () => {
    const email = normalizeEmail(targetEmail);

    if (!session) {
      toast.error("Admin session expired. Please verify OTP again.", {
        theme: "dark",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Enter a valid user email to reset.", { theme: "dark" });
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch(RESET_GENERATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          requestId: targetRequestId.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const message = getApiMessage(data, "Failed to reset generation state.");

      if (!response.ok || !data?.success) {
        throw new Error(message);
      }

      toast.success(
        data?.message || "Generation state reset successfully for this email.",
        { theme: "dark" },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reset generation state.";
      toast.error(message, { theme: "dark" });
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setAuthOtp("");
    setIsOtpSent(false);
    setRequestId("");
    toast.info("Logged out from admin dashboard.", { theme: "dark" });
  };

  if (!session) {
    return (
      <section className="min-h-screen bg-[#050505] pt-32 pb-16 text-white">
        <div className="container mx-auto px-6 max-w-xl">
          <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-[#FF4500]" />
              <h1 className="text-3xl font-serif">Admin Dashboard Login</h1>
            </div>



            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Admin Mobile Number</label>
                <PhoneInput 
                  value={authPhone}
                  onChange={(val) => setAuthPhone(val)}
                  placeholder="Enter your number"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="w-full rounded-full bg-white text-black py-3 font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                {isSendingOtp ? "Sending OTP..." : "Request OTP"}
              </button>

              {isOtpSent && (
                <>
                  <input
                    type="text"
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full rounded-full bg-white/5 border border-[#FF4500]/35 px-5 py-3 text-sm text-white placeholder-white/30 tracking-[0.3em] text-center focus:outline-none focus:border-[#FF4500]"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    className="w-full rounded-full bg-[#FF4500] text-white py-3 font-semibold text-sm hover:bg-[#ff5d1f] transition-colors disabled:opacity-60"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              {requestId && (
                <p className="text-xs text-gray-500 break-all">
                  Session ID: {requestId}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#050505] pt-32 pb-16 text-white">
      <div className="container mx-auto px-6 max-w-4xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-serif">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-2">Logged in as {session.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-semibold">Allowed Admin Emails</h2>

            <div className="flex gap-2">
              <input
                type="email"
                value={newAllowedEmail}
                onChange={(e) => setNewAllowedEmail(e.target.value)}
                placeholder="Add allowed email"
                className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4500]/60"
              />
              <button
                type="button"
                onClick={handleAddAllowedEmail}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-4 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-auto pr-1">
              {allowlist.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <span className="text-sm text-gray-200 break-all">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllowedEmail(email)}
                    className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={`Remove ${email}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-semibold">Reset User Generation</h2>
            <p className="text-sm text-gray-400">
              Use the reset API to allow a user email to generate image again.
            </p>

            <input
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="User email"
              className="w-full rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4500]/60"
            />

            <input
              type="text"
              value={targetRequestId}
              onChange={(e) => setTargetRequestId(e.target.value)}
              placeholder="Request ID (optional)"
              className="w-full rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4500]/60"
            />

            <button
              type="button"
              onClick={handleResetGeneration}
              disabled={isResetting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4500] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ff5d1f] transition-colors disabled:opacity-60"
            >
              <RotateCcw className="w-4 h-4" />
              {isResetting ? "Resetting..." : "Reset Generation"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
