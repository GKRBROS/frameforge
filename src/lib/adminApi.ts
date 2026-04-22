import { toast } from "react-toastify";

const BASE_URL = "https://memento.frameforge.one/api";

export interface AdminUser {
  id: string;
  email: string;
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
  async requestOtp(email: string) {
    return this.request<{ email: string; expiresInMinutes: number; emailSent: boolean }>(
      "/admin/request-otp",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  }

  async verifyOtp(email: string, otp: string) {
    return this.request<{ verified: boolean; admin: { email: string; name: string } }>(
      "/admin/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }
    );
  }

  // Admin Management
  async registerAdmin(email: string, name: string) {
    return this.request<AdminUser>("/admin/register", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
  }

  // Note: List/Delete/Update endpoints are not explicitly documented with endpoints in MD 
  // but implied by CRUD requirements. Using standard REST patterns.
  async listAdmins() {
    return this.request<AdminUser[]>("/admin/list", { method: "GET" });
  }

  async deleteAdmin(email: string) {
    return this.request<{ success: boolean }>("/admin/delete", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    });
  }

  // User/Image management as implied by "Admin Dashboard" context
  async resetUserGeneration(email: string, requestId?: string) {
    return this.request<{ success: boolean; status: string }>("/generate/reset", {
      method: "POST",
      body: JSON.stringify({ email, requestId }),
    });
  }
}

export const adminApi = new AdminApiService();
