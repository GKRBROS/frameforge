import { toast } from "react-toastify";

const BASE_URL = "https://memento.frameforge.one/api";

export interface AdminUser {
  id: string;
  phone: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  requestId?: string;
}

class AdminApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
        return { success: false, error: errorMsg };
      }

      return { success: true, data, requestId: data.requestId };
    } catch (error) {
      console.error(`API Request Error [${endpoint}]:`, error);
      return { success: false, error: "Network error or server unavailable" };
    }
  }

  // Auth Endpoints
  async requestOtp(phone: string) {
    return this.request<{ phone: string; expiresInMinutes: number; smsSent: boolean }>(
      "/admin/request-otp",
      {
        method: "POST",
        body: JSON.stringify({ phone }),
      }
    );
  }

  async verifyOtp(phone: string, otp: string) {
    return this.request<{ verified: boolean; admin: { phone: string; name: string } }>(
      "/admin/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      }
    );
  }

  // Admin Management
  async registerAdmin(phone: string, name: string) {
    return this.request<AdminUser>("/admin/register", {
      method: "POST",
      body: JSON.stringify({ phone, name }),
    });
  }

  async listAdmins() {
    return this.request<AdminUser[]>("/admin/list", { method: "GET" });
  }

  async deleteAdmin(phone: string) {
    return this.request<{ success: boolean }>("/admin/delete", {
      method: "DELETE",
      body: JSON.stringify({ phone }),
    });
  }

  // User/Image management
  async resetUserGeneration(phone: string, requestId?: string) {
    return this.request<{ success: boolean; status: string }>("/generate/reset", {
      method: "POST",
      body: JSON.stringify({ phone, requestId }),
    });
  }
}

export const adminApi = new AdminApiService();
