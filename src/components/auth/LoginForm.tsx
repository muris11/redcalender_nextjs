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
import { Loading } from "@/components/ui/loading";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff } from "lucide-react";
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
            Masuk ke akun Anda untuk melanjutkan
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
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                placeholder="Masukkan Email"
                className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl"
              />
            </div>

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
                  placeholder="Masukkan Password"
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
                  Masuk...
                </div>
              ) : (
                "Masuk"
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
                  Belum punya akun?
                </span>
              </div>
            </div>
            <Link
              href="/register"
              className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-bold text-base hover:underline transition-all"
            >
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
