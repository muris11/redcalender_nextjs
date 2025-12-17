"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoading } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
}

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  hint?: string;
}

function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  hint,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-700 font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER" as "USER" | "ADMIN",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          toast.error("Gagal memuat data pengguna");
          router.push("/admin/users");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data pengguna");
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Nama dan email wajib diisi");
      return;
    }

    // Validate password if provided
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Kata sandi baru dan konfirmasi tidak cocok");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Kata sandi baru minimal 6 karakter");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const submitData: any = {
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };

      // Only include password if provided
      if (formData.newPassword.trim() !== "") {
        submitData.password = formData.newPassword;
      }

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Pengguna berhasil diperbarui");
        router.push("/admin/users");
      } else {
        toast.error(data.error || "Gagal memperbarui pengguna");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return <PageLoading text="Memuat data pengguna..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-3 mb-8 p-8 text-white shadow-2xl shadow-blue-500/20 border border-white/10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/users")}
              className="text-white hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-110 rounded-xl"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Edit Pengguna ✏️
              </h1>
              <p className="text-blue-100 text-lg font-medium opacity-90 mt-2">
                Perbarui informasi pengguna
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Form Section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-bold">
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-bold">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan alamat email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-bold">
                    Nomor Telepon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Masukkan nomor telepon"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700 font-bold">
                    Peran *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "USER" | "ADMIN") =>
                      handleInputChange("role", value)
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Pengguna</SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t border-slate-200/50 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Ubah Kata Sandi (Opsional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PasswordInput
                    id="newPassword"
                    label="Kata Sandi Baru"
                    placeholder="Masukkan kata sandi baru"
                    value={formData.newPassword}
                    onChange={(value) =>
                      handleInputChange("newPassword", value)
                    }
                    showPassword={showNewPassword}
                    onToggleVisibility={() =>
                      setShowNewPassword(!showNewPassword)
                    }
                    hint="Biarkan kosong jika tidak ingin mengubah kata sandi"
                  />

                  <PasswordInput
                    id="confirmPassword"
                    label="Konfirmasi Kata Sandi Baru"
                    placeholder="Konfirmasi kata sandi baru"
                    value={formData.confirmPassword}
                    onChange={(value) =>
                      handleInputChange("confirmPassword", value)
                    }
                    showPassword={showConfirmPassword}
                    onToggleVisibility={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-blue-700 font-medium">
                  <strong>Catatan:</strong> Kata sandi akan diubah hanya jika
                  Anda mengisi field kata sandi baru. Pastikan kata sandi
                  minimal 6 karakter.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/users")}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none hover:bg-slate-50 transition-all duration-200 rounded-xl border-slate-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Perbarui Pengguna
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
