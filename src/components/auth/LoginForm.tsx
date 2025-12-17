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
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
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

    if (result.success) {
      // Get user from auth store after successful login
      const { user } = useAuthStore.getState();

      // Show loading screen before redirect
      setIsRedirectLoading(true);
      if (user?.role === "ADMIN") {
        setRedirectText("Memuat dashboard admin...");
        setTimeout(() => router.push("/admin"), 1500);
      } else if (user?.isOnboarded) {
        setRedirectText("Memuat dashboard...");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setRedirectText("Memuat onboarding...");
        setTimeout(() => router.push("/onboarding"), 1500);
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
        <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[100px]"></div>
          </div>

          <Card className="w-full max-w-md border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl relative z-10">
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
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-base text-gray-600 font-medium">
                Masuk untuk melanjutkan perjalanan kesehatan Anda
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="nama@email.com"
                      className="h-12 pl-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-pink-500 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-base font-semibold text-gray-700"
                    >
                      Password
                    </Label>
                  </div>
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
                      placeholder="••••••••"
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
                      Masuk...
                    </div>
                  ) : (
                    "Masuk Sekarang"
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
                      Belum punya akun?
                    </span>
                  </div>
                </div>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-700 font-bold py-6 rounded-xl transition-all"
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
