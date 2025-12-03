"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GuestLayout from "./(guest)/layout";
import GuestHome from "./(guest)/page";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
    // If not authenticated, show guest home page
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  // Show guest home page for unauthenticated users wrapped in guest layout
  return (
    <GuestLayout>
      <GuestHome />
    </GuestLayout>
  );
}
