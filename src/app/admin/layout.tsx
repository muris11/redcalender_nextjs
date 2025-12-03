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
    <div className="h-full relative bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 min-h-screen">
      {/* Admin Navbar - Always visible */}
      <AdminNavbar
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-80 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="pt-16">
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-80 pt-16 min-h-screen transition-all duration-300 ease-in-out">
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
