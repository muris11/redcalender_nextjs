"use client";

import { PageLoading } from "@/components/ui/loading";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage once on mount
    useAuthStore.getState().initialize();

    // Failsafe: If still loading after 3 seconds, force stop loading
    const timeout = setTimeout(() => {
      if (useAuthStore.getState().isLoading) {
        console.warn("Auth loading timeout - forcing initialization");
        useAuthStore.setState({ isLoading: false, initialized: true });
        setLoadingTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) {
      console.log("UserLayout: Still loading auth state...");
      return;
    }

    console.log("UserLayout: Auth loaded", {
      isAuthenticated,
      user: user?.email,
      role: user?.role,
    });

    if (!isAuthenticated) {
      console.log("UserLayout: Not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    // Prevent admin users from accessing user pages
    if (user?.role === "ADMIN") {
      console.log(
        "UserLayout: Admin user detected, redirecting to admin panel"
      );
      router.push("/admin");
      return;
    }

    // Allow access to onboarding page for users who haven't completed it
    const isOnOnboardingPage = window.location.pathname === "/onboarding";

    // Only check onboarding status if user data is fully loaded
    if (user && typeof user.isOnboarded === "boolean") {
      console.log("UserLayout: Checking onboarding status", {
        isOnboarded: user.isOnboarded,
        isOnOnboardingPage,
      });

      if (!user.isOnboarded && !isOnOnboardingPage) {
        console.log(
          "UserLayout: User not onboarded, redirecting to onboarding"
        );
        router.push("/onboarding");
        return;
      }

      // If user is already onboarded and on onboarding page, allow them to stay
      // (they might be editing their data)
      if (user.isOnboarded && isOnOnboardingPage) {
        console.log(
          "UserLayout: User already onboarded but on onboarding page (allowing for editing)"
        );
      }
    }

    console.log("UserLayout: Authorization granted");
    setIsAuthorized(true);
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading with timeout warning
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
        <PageLoading />
        {loadingTimeout && (
          <p className="mt-4 text-sm text-gray-600">
            Loading is taking longer than usual. Please refresh if this
            persists.
          </p>
        )}
      </div>
    );
  }

  if (!isAuthorized) {
    return <PageLoading />;
  }

  return <>{children}</>;
}
