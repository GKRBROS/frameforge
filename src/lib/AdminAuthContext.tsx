import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser, adminApi } from "@/lib/adminApi";

interface AdminSession {
  email: string;
  verifiedAt: number;
}

interface AdminAuthContextType {
  session: AdminSession | null;
  login: (email: string) => Promise<boolean>;
  verify: (otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = "frameforge.admin.session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AdminSession;
        if (Date.now() - parsed.verifiedAt < SESSION_TTL_MS) {
          setSession(parsed);
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    const response = await adminApi.requestOtp(email);
    if (response.success) {
      setAuthEmail(email);
      return true;
    }
    return false;
  };

  const verify = async (otp: string) => {
    const response = await adminApi.verifyOtp(authEmail, otp);
    if (response.success && response.data?.verified) {
      const newSession = { email: authEmail, verifiedAt: Date.now() };
      setSession(newSession);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
      return true;
    }
    return false;
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ 
      session, 
      login, 
      verify, 
      logout, 
      isAuthenticated: !!session,
      isLoading 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
