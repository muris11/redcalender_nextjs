"use client";

import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PageLoading } from "@/components/ui/loading";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, isLoading, router]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading || !isAuthorized) {
    return <PageLoading />;
  }

  return (
    <div className="h-full relative bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Admin Navbar - Always visible */}
      <AdminNavbar
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:top-0 z-40 pt-20 bg-white/40 backdrop-blur-xl border-r border-white/20 shadow-xl">
        <AdminSidebar onNavigate={() => {}} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-80 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-20 h-full">
            <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-80 pt-20 min-h-screen transition-all duration-300 ease-in-out">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
