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
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirectLoading, setIsRedirectLoading] = useState(false);
  const [redirectText, setRedirectText] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success && result.redirectUrl) {
      setIsRedirectLoading(true);
      
      if (result.redirectUrl === "/admin") {
        setRedirectText("Memuat dashboard admin...");
      } else if (result.redirectUrl === "/dashboard") {
        setRedirectText("Memuat dashboard...");
      } else {
        setRedirectText("Memuat onboarding...");
      }
      
      window.location.href = result.redirectUrl;
    } else if (result.success) {
      const { user } = useAuthStore.getState();
      setIsRedirectLoading(true);
      
      if (user?.role === "ADMIN") {
        setRedirectText("Memuat dashboard admin...");
        window.location.href = "/admin";
      } else if (user?.isOnboarded) {
        setRedirectText("Memuat dashboard...");
        window.location.href = "/dashboard";
      } else {
        setRedirectText("Memuat onboarding...");
        window.location.href = "/onboarding";
      }
    } else {
      setError(result.error || "Login gagal");
    }
  };

  return (
    <>
      {isRedirectLoading ? (
        <PageLoading text={redirectText} />
      ) : (
        <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50/60 flex items-start justify-center pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.08),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.08),transparent_45%)]"></div>
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ec4899_1px,transparent_1px)] bg-size-[16px_16px]"></div>

          <Card className="w-full max-w-md shadow-xl border border-gray-100/70 bg-white/95 backdrop-blur-xl rounded-2xl relative z-10 overflow-hidden">
            
            <CardHeader className="text-center space-y-4 pb-6 pt-10 px-6">
              <Link href="/" className="inline-block mx-auto group">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-500/20 rounded-2xl blur-xl group-hover:bg-pink-500/30 transition-all duration-300"></div>
                  <img
                    src="/logo.png"
                    alt="Red Calender Logo"
                    className="h-16 w-16 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Selamat Datang Kembali
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-500">
                  Masuk untuk melanjutkan perjalanan kesehatan Anda
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Alamat Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="nama@email.com"
                        className="pl-11 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl text-gray-900 placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required
                        placeholder="Masukkan password"
                        className="pl-11 pr-11 h-12 border-gray-200 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all rounded-xl text-gray-900 placeholder:text-gray-400 shadow-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
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
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 font-semibold text-base mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loading size="sm" text="" className="text-white" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Belum punya akun?
                    </span>
                  </div>
                </div>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all"
                  >
                    Daftar Akun Baru
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
