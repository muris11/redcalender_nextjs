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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
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

    // Validasi password
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
      // Immediately show loading state and redirect to onboarding
      setRedirectText("Memuat onboarding...");
      setIsRedirectLoading(true);
      toast.success(
        "Registrasi berhasil! Mengalihkan ke halaman onboarding..."
      );
      // Use replace so the back button doesn't return to registration
      router.replace("/onboarding");
    } else {
      setError(result.error || "Registrasi gagal");
    }
  };

  return (
    <>
      {isRedirectLoading ? (
        <PageLoading text={redirectText} />
      ) : (
        <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-pink-300/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[100px]"></div>
          </div>

          <Card className="w-full max-w-2xl border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl relative z-10">
            <div className="h-2 bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient bg-300%"></div>
            <CardHeader className="text-center space-y-3 pb-8 pt-8">
              <Link href="/" className="inline-block mx-auto hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="Red Calender Logo"
                  className="h-20 w-20 object-contain drop-shadow-md"
                />
              </Link>
              <CardTitle className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Buat Akun Baru
              </CardTitle>
              <CardDescription className="text-base text-gray-600 font-medium">
                Bergabunglah dengan komunitas kami untuk hidup lebih sehat
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informasi Pribadi */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-pink-100">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">1</div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Informasi Pribadi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label
                        htmlFor="name"
                        className="text-base font-semibold text-gray-700"
                      >
                        Nama Lengkap
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                          placeholder="Masukkan nama lengkap"
                          className="h-12 pl-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-pink-500 transition-all rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-base font-semibold text-gray-700"
                      >
                        Email
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                          placeholder="nama@email.com"
                          className="h-12 pl-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-pink-500 transition-all rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-base font-semibold text-gray-700"
                      >
                        Nomor Telepon
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="0812..."
                          className="h-12 pl-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-pink-500 transition-all rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-pink-100">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">2</div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Keamanan Akun
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="password"
                        className="text-base font-semibold text-gray-700"
                      >
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                          placeholder="Minimal 6 karakter"
                          className="h-12 pl-12 pr-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-pink-500 transition-all rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
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

                    <div className="space-y-3">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-base font-semibold text-gray-700"
                      >
                        Konfirmasi Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          required
                          placeholder="Ulangi password"
                          className="h-12 pl-12 pr-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-pink-500 transition-all rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
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
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-pink-100">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">3</div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Personalisasi Tema
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">
                      Pilih Tema Favorit Anda
                    </Label>
                    <RadioGroup
                      value={formData.theme}
                      onValueChange={(value) =>
                        handleInputChange("theme", value)
                      }
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      {[
                        { id: "kucing", label: "Kucing", icon: "🐱", color: "border-orange-200 bg-orange-50" },
                        { id: "gajah", label: "Gajah", icon: "🐘", color: "border-blue-200 bg-blue-50" },
                        { id: "unicorn", label: "Unicorn", icon: "🦄", color: "border-purple-200 bg-purple-50" },
                      ].map((theme) => (
                        <div key={theme.id} className={`relative flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${formData.theme === theme.id ? `border-pink-500 bg-pink-50 shadow-md` : `border-gray-100 hover:border-pink-200`}`}>
                          <RadioGroupItem
                            value={theme.id}
                            id={`theme-${theme.id}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`theme-${theme.id}`}
                            className="flex flex-col items-center justify-center w-full cursor-pointer gap-2"
                          >
                            <span className="text-4xl">{theme.icon}</span>
                            <span className="font-bold text-gray-700">{theme.label}</span>
                          </Label>
                          {formData.theme === theme.id && (
                            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500"></div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 shrink-0"></div>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-pink-200/50 transition-all font-bold py-6 rounded-xl border-0 text-base"
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
                    <span className="px-4 bg-white/80 backdrop-blur-xl text-gray-500 font-medium">
                      Sudah punya akun?
                    </span>
                  </div>
                </div>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-700 font-bold py-6 rounded-xl transition-all"
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
