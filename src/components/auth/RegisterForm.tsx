"use client";

import PageLoading from "@/components/PageLoading";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avgCycleLength: "28",
    avgPeriodLength: "6",
    theme: "kucing",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirectLoading, setIsRedirectLoading] = useState(false);
  const [redirectText, setRedirectText] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avgCycleLength: parseInt(formData.avgCycleLength),
      avgPeriodLength: parseInt(formData.avgPeriodLength),
      theme: formData.theme,
    });

    if (result.success) {
      setRedirectText("Memuat onboarding...");
      setIsRedirectLoading(true);
      toast.success(
        "Registrasi berhasil! Mengalihkan ke halaman onboarding..."
      );
      
      // Small delay to ensure cookie is set before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = "/onboarding";
    } else {
      setError(result.error || "Registrasi gagal");
    }
  };

  return (
    <>
      {isRedirectLoading ? (
        <PageLoading text={redirectText} />
      ) : (
        <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50/60 flex items-start justify-center pt-24 sm:pt-28 pb-10 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.08),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.08),transparent_45%)]"></div>
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ec4899_1px,transparent_1px)] bg-size-[16px_16px]"></div>

          <Card className="w-full max-w-2xl shadow-xl border border-gray-100/70 bg-white/95 backdrop-blur-xl rounded-2xl relative z-10">
            <CardHeader className="text-center space-y-3 pb-6 pt-8">
              <Link href="/" className="inline-block mx-auto hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="Red Calender Logo"
                  className="h-14 w-14 object-contain drop-shadow-md"
                />
              </Link>
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Buat Akun Baru
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-500">
                Bergabunglah dengan komunitas kami untuk hidup lebih sehat
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Pribadi */}
                <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200/70">
                    <div className="h-8 w-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 font-bold">1</div>
                    <Heading size="heading-sm" className="text-gray-900 font-semibold">
                      Informasi Pribadi
                    </Heading>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Nama Lengkap</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                          placeholder="Masukkan nama lengkap"
                          className="pl-10 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                          placeholder="nama@email.com"
                          className="pl-10 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Nomor Telepon</Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="0812..."
                          className="pl-10 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200/70">
                    <div className="h-8 w-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 font-bold">2</div>
                    <Heading size="heading-sm" className="text-gray-900 font-semibold">
                      Keamanan Akun
                    </Heading>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                          placeholder="Minimal 6 karakter"
                          className="pl-10 pr-10 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl shadow-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Konfirmasi Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          required
                          placeholder="Ulangi password"
                          className="pl-10 pr-10 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl shadow-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personalisasi Tema */}
                <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200/70">
                    <div className="h-8 w-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 font-bold">3</div>
                    <Heading size="heading-sm" className="text-gray-900 font-semibold">
                      Personalisasi Tema
                    </Heading>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Pilih Tema Favorit Anda</Label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) =>
                        handleInputChange("theme", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-white border-gray-200 shadow-sm">
                        <SelectValue placeholder="Pilih Tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kucing">
                          <div className="flex items-center gap-2">
                            <span>🐱</span>
                            <span>Kucing</span>
                            <span className="text-xs text-muted-foreground">(Pink & Rose)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gajah">
                          <div className="flex items-center gap-2">
                            <span>🐘</span>
                            <span>Gajah</span>
                            <span className="text-xs text-muted-foreground">(Purple & Lavender)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="unicorn">
                          <div className="flex items-center gap-2">
                            <span>🦄</span>
                            <span>Unicorn</span>
                            <span className="text-xs text-muted-foreground">(Teal & Cyan)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sapi">
                          <div className="flex items-center gap-2">
                            <span>🐄</span>
                            <span>Sapi</span>
                            <span className="text-xs text-muted-foreground">(Hitam & Putih)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="bg-pink-50 border border-pink-200 text-pink-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500 shrink-0"></div>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 rounded-full bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-md hover:shadow-lg hover:shadow-pink-200 transition-all duration-300 font-semibold text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loading size="sm" text="" className="mr-2 text-white" />
                      Mendaftar...
                    </div>
                  ) : (
                    "Buat Akun Sekarang"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium">
                      Sudah punya akun?
                    </span>
                  </div>
                </div>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-700 font-semibold transition-all"
                  >
                    Masuk ke Akun Saya
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
