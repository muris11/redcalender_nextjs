"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsCheckingSession(false);
        } else {
          useAuthStore.getState().initialize();
          setIsCheckingSession(false);
        }
      } catch (error) {
        useAuthStore.getState().initialize();
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [setUser]);

  useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (user?.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    const isOnOnboardingPage = window.location.pathname === "/onboarding";

    if (user && typeof user.isOnboarded === "boolean") {
      if (!user.isOnboarded && !isOnOnboardingPage) {
        router.push("/onboarding");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, isLoading, isCheckingSession, router]);

  if (isCheckingSession || isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthorized) {
    return <UnifiedPageLoading />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="
          flex md:hidden 
          h-14 sm:h-16 shrink-0 
          items-center gap-2 
          border-b border-border/40 
          bg-background/95 backdrop-blur 
          supports-[backdrop-filter]:bg-background/60 
          px-4 sticky top-0 z-40
          safe-area-pt
        ">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Red Calender"
              className="h-6 w-6 object-contain"
            />
            <span className="font-bold text-gradient">Red Calender</span>
          </div>
        </header>

        <main className="
          flex-1 overflow-auto scroll-smooth
          scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent
          pb-20 md:pb-0
        ">
          <div className="
            min-h-screen bg-background
            bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
            from-transparent via-transparent to-muted/20
          ">
            {children}
          </div>
        </main>
      </SidebarInset>
      
      <BottomNavigation />
    </SidebarProvider>
  );
}
