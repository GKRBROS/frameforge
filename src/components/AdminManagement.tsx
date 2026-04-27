import React, { useState, useEffect } from "react";
import { 
  Users, 
  Shield, 
  Search, 
  Plus, 
  Trash2, 
  UserCircle, 
  MoreVertical,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { AdminUser, adminApi } from "@/lib/adminApi";
import { AdminCard, AdminButton, AdminInput, AdminBadge } from "@/components/AdminUI";
import { PhoneInput } from "@/components/PhoneInput";

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({ phone: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    const response = await adminApi.listAdmins();
    if (response.success && response.data) {
      setAdmins(response.data);
    } else {
      toast.error("Failed to load administrators. Please check your connection.");
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

    if (!newAdmin.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(newAdmin.phone)) {
      newErrors.phone = "Invalid phone format (e.g., +91...)";
    }
    
    if (!newAdmin.name) newErrors.name = "Name is required";
    else if (newAdmin.name.length < 2) newErrors.name = "Name must be at least 2 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const response = await adminApi.registerAdmin(newAdmin.phone, newAdmin.name);
    
    if (response.success) {
      toast.success("Administrator registered successfully");
      setIsModalOpen(false);
      setNewAdmin({ phone: "", name: "" });
      fetchAdmins();
    } else {
      toast.error(response.error || "Failed to register administrator");
      if (response.error?.includes("already exist")) {
        setErrors({ phone: "This phone number is already registered as an admin" });
      }
    }
    setIsSubmitting(false);
  };

  const handleDeleteAdmin = async () => {
    if (!deleteConfirm) return;

    const response = await adminApi.deleteAdmin(deleteConfirm);
    if (response.success) {
      toast.success("Administrator removed");
      setDeleteConfirm(null);
      fetchAdmins();
    } else {
      toast.error(response.error || "Failed to remove administrator");
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" />
            Admin Management
          </h2>
          <p className="text-sm text-neutral-400">Manage system administrators and their permissions</p>
        </div>
        <AdminButton onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Add Administrator
        </AdminButton>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase">Total Admins</p>
            <p className="text-2xl font-bold text-white">{admins.length}</p>
          </div>
        </AdminCard>
        
        <div className="md:col-span-2">
          <div className="relative group h-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text"
              placeholder="Search by name or phone..."
              className="w-full h-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8">
                      <div className="h-4 bg-white/5 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No administrators found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                          <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{admin.name}</p>
                          <p className="text-xs text-neutral-500">{admin.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge variant="success">Active</AdminBadge>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-400 font-mono">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminButton 
                        variant="danger" 
                        onClick={() => setDeleteConfirm(admin.phone)}
                        className="opacity-0 group-hover:opacity-100 p-2"
                        title="Remove Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </AdminButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <AdminCard className="relative w-full max-w-md p-8 shadow-2xl border-white/10" title="Add New Administrator">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAddAdmin} className="space-y-6">
              <AdminInput 
                label="Full Name"
                placeholder="John Doe"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                error={errors.name}
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <PhoneInput 
                  value={newAdmin.phone}
                  onChange={(val) => setNewAdmin({ ...newAdmin, phone: val })}
                  placeholder="Enter admin number"
                />
                {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
              </div>

              <div className="pt-2 flex gap-3">
                <AdminButton 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </AdminButton>
                <AdminButton 
                  type="submit" 
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  Register Admin
                </AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <AdminCard className="relative w-full max-w-sm p-8 shadow-2xl border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Remove Administrator?</h3>
            <p className="text-sm text-neutral-400 mb-8">
              Are you sure you want to remove <span className="text-white font-medium">{deleteConfirm}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <AdminButton 
                variant="outline" 
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton 
                variant="danger" 
                className="flex-1"
                onClick={handleDeleteAdmin}
              >
                Remove
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
};
