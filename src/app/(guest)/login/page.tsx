"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50/50 relative overflow-hidden">
        {/* <div className="absolute top-20 left-10 w-96 h-96 bg-pink-200/30 rounded-full blur-[100px] animate-pulse"></div> */}
        {/* <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[120px]"></div> */}
        <Loader2 className="h-10 w-10 animate-spin text-pink-600 relative z-10" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <LoginForm />;
}
