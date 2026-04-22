import React, { useState } from "react";
import { 
  ShieldCheck, 
  Mail, 
  RotateCcw, 
  LogOut, 
  Users, 
  BarChart3, 
  Settings, 
  Zap,
  Menu,
  X,
  User,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import { adminApi } from "@/lib/adminApi";
import { AdminCard, AdminButton, AdminInput } from "@/components/AdminUI";
import { AdminManagement } from "@/components/AdminManagement";

export const AdminDashboard = () => {
  const { session, login, verify, logout, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  
  const [activeTab, setActiveTab] = useState<"admins" | "users">("users");
  const [authEmail, setAuthEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // User Reset State
  const [targetEmail, setTargetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const handleSendOtp = async () => {
    if (!authEmail) return toast.error("Email is required");
    setIsBusy(true);
    const success = await login(authEmail);
    if (success) {
      setIsOtpSent(true);
      toast.success("OTP sent to your email");
    } else {
      toast.error("Access denied. Please check your credentials.");
    }
    setIsBusy(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("OTP is required");
    setIsBusy(true);
    const success = await verify(otp);
    if (success) {
      toast.success("Authentication successful");
    } else {
      toast.error("Invalid or expired OTP");
    }
    setIsBusy(false);
  };

  const handleResetUser = async () => {
    if (!targetEmail) return toast.error("User email is required");
    setIsResetting(true);
    const response = await adminApi.resetUserGeneration(targetEmail);
    if (response.success) {
      toast.success(`Reset generation for ${targetEmail}`);
      setTargetEmail("");
    } else {
      toast.error(response.error || "Failed to reset generation");
    }
    setIsResetting(false);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        </div>

        <AdminCard className="w-full max-w-md p-8 relative z-10 border-white/5 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white font-stack">Admin Access</h1>
            <p className="text-sm text-neutral-500 mt-2">Enter your authorized email to receive an access code</p>
          </div>

          {!isOtpSent ? (
            <div className="space-y-4">
              <AdminInput 
                label="Authorized Email"
                placeholder="admin@frameforge.one"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
              <AdminButton 
                className="w-full h-12" 
                onClick={handleSendOtp}
                isLoading={isBusy}
              >
                Send Access Code
              </AdminButton>
            </div>
          ) : (
            <div className="space-y-4">
              <AdminInput 
                label="Verification Code"
                placeholder="6-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              />
              <div className="flex flex-col gap-3">
                <AdminButton 
                  className="w-full h-12" 
                  onClick={handleVerifyOtp}
                  isLoading={isBusy}
                >
                  Verify & Enter Dashboard
                </AdminButton>
                <button 
                  className="text-xs text-neutral-500 hover:text-white transition-colors py-2"
                  onClick={() => setIsOtpSent(false)}
                >
                  Back to email entry
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
            <Link to="/" className="text-xs text-neutral-500 hover:text-white flex items-center gap-2 transition-colors">
              <Home className="w-3 h-3" />
              Return to Home
            </Link>
          </div>
        </AdminCard>
      </div>
    );
  }

  // Sidebar Menu Items
  const menuItems = [
    { id: "users", label: "Retry Generation", icon: RotateCcw },
    { id: "admins", label: "Admins", icon: Users },
  ] as const;

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-orange-500" />
          <span className="font-bold font-stack tracking-tight">Admin Console</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-neutral-400 hover:text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/5 transition-transform duration-300 transform lg:translate-x-0 lg:static
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-lg font-stack tracking-tight leading-tight">Admin Console</p>
              <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">Frame Forge v1.0</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                  ${activeTab === item.id 
                    ? "bg-white/10 text-white border border-white/5 shadow-lg" 
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                  }
                `}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-orange-500" : ""}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 mt-8 border-t border-white/5">
            <div className="flex items-center gap-3 px-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <User className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{session?.email}</p>
                <p className="text-[10px] text-neutral-500">Super Administrator</p>
              </div>
            </div>
            <AdminButton variant="ghost" className="w-full justify-start text-red-500/70 hover:text-red-500 hover:bg-red-500/5" onClick={logout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </AdminButton>

            <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all font-medium text-sm">
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 pt-24 lg:pt-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === "users" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold font-stack mb-2">Retry Generation</h1>
                <p className="text-neutral-400">Reset the generation status for a user to allow them to try again.</p>
              </div>

              <AdminCard className="p-8">
                <div className="max-w-xl space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">User Email Address</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <AdminInput 
                        placeholder="user@example.com"
                        value={targetEmail}
                        onChange={(e) => setTargetEmail(e.target.value)}
                        className="flex-1"
                      />
                      <AdminButton 
                        variant="secondary"
                        className="whitespace-nowrap h-[42px] px-8"
                        onClick={handleResetUser}
                        isLoading={isResetting}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Generation
                      </AdminButton>
                    </div>
                    <p className="text-xs text-neutral-500 italic">
                      Note: This will clear the generation status in the database, allowing the user to initiate a new request.
                    </p>
                  </div>
                </div>
              </AdminCard>
            </div>
          )}

          {activeTab === "admins" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold font-stack mb-2">Admin Management</h1>
                <p className="text-neutral-400">Add or remove administrative users for this console.</p>
              </div>
              <AdminManagement />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
