"use client";

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
import { Loading, PageLoading } from "@/components/ui/loading";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff } from "lucide-react";
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
      // Show loading screen before redirect
      setIsRedirectLoading(true);
      setTimeout(() => {
        toast.success(
          "Registrasi berhasil! Mengalihkan ke halaman onboarding..."
        );
        router.push("/onboarding");
      }, 1500);
    } else {
      setError(result.error || "Registrasi gagal");
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 15 - i); // Usia 15-65 tahun

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl overflow-hidden">
        <div className="h-3 bg-linear-to-r from-pink-400 via-purple-400 to-pink-400"></div>
        <CardHeader className="text-center space-y-3 pb-8 pt-8">
          <img
            src="/logo.png"
            alt="Red Calendar Logo"
            className="mx-auto h-20 w-20 object-contain"
          />
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Red Calendar
          </CardTitle>
          <CardDescription className="text-base text-gray-600 font-medium">
            Daftar untuk mulai mencatat siklus menstruasi Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Pribadi */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-pink-100">
                <h3 className="font-bold text-gray-800 text-lg">
                  Informasi Pribadi
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold text-gray-700"
                  >
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap"
                    className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base font-semibold text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    placeholder="email@example.com"
                    className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-base font-semibold text-gray-700"
                  >
                    Nomor Telepon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-pink-100">
                <h3 className="font-bold text-gray-800 text-lg">
                  Keamanan Akun
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-base font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      placeholder="Minimal 6 karakter"
                      className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
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
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      required
                      placeholder="Ulangi password"
                      className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalisasi Tema */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-pink-100">
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
                  onValueChange={(value) => handleInputChange("theme", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem
                      value="kucing"
                      id="theme-kucing"
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="theme-kucing"
                      className="text-base cursor-pointer flex-1"
                    >
                      🐱 Kucing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem
                      value="gajah"
                      id="theme-gajah"
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="theme-gajah"
                      className="text-base cursor-pointer flex-1"
                    >
                      🐘 Gajah
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem
                      value="unicorn"
                      id="theme-unicorn"
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="theme-unicorn"
                      className="text-base cursor-pointer flex-1"
                    >
                      🦄 Unicorn
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all font-bold py-6 rounded-xl border-0 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loading size="sm" text="" className="mr-2" />
                  Mendaftar...
                </div>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Sudah punya akun?
                </span>
              </div>
            </div>
            <Link
              href="/login"
              className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-bold text-base hover:underline transition-all"
            >
              Login di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
