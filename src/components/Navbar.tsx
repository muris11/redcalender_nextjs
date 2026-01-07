"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { useAuthStore } from "@/store/authStore";
import {
    BookOpen,
    Calendar,
    ChevronDown,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    TrendingUp,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getThemeLabel = () => {
    switch (theme) {
      case 'kucing': return '🐱 Kucing';
      case 'gajah': return '🐘 Gajah';
      case 'unicorn': return '🦄 Unicorn';
      case 'sapi': return '🐄 Sapi';
      default: return '🐱 Kucing';
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/calender", label: "Kalender", icon: Calendar },
    { href: "/log", label: "Log Harian", icon: Plus },
    { href: "/analysis", label: "Analisis", icon: TrendingUp },
    { href: "/education", label: "Edukasi", icon: BookOpen },
    { href: "/report", label: "Laporan", icon: FileText },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
  ];

  const navItems = user?.role === "ADMIN" ? adminNavItems : userNavItems;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/20">
      <div className="w-full px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section - Kiri */}
          <div className="flex items-center shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-theme rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <img
                  src="/logo.png"
                  alt="Red Calender Logo"
                  className="relative h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-gradient">
                Red Calender
              </span>
            </Link>
          </div>

          {/* Navigation Items - Tengah */}
          <div className="hidden lg:flex items-center justify-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    active ? "text-white shadow-md" : "text-gray-600 hover:text-theme"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-theme rounded-full"></div>
                  )}
                  {!active && (
                    <div className="absolute inset-0 bg-theme-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <Icon
                    className={`relative h-4 w-4 mr-2 shrink-0 ${
                      active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-theme"
                    }`}
                  />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Kanan */}
          <div className="hidden lg:flex items-center justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-auto p-1.5 rounded-full hover:bg-pink-50/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3 pr-2">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-theme/20 group-hover:ring-theme/40 transition-all">
                        <AvatarImage src="" alt={user?.name || "User"} />
                        <AvatarFallback className="bg-gradient-theme text-white font-bold text-sm">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <div className="text-left hidden xl:block">
                          <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email?.substring(0, 20)}
                            {user?.email && user.email.length > 20 ? "..." : ""}
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-theme transition-colors" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 glass-card border-white/20 p-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="p-3 cursor-pointer hover:bg-theme-light rounded-xl transition-all group focus:bg-theme-light"
                  >
                    <div className="h-8 w-8 rounded-lg bg-theme-light group-hover:bg-theme/20 flex items-center justify-center mr-3 transition-colors">
                      <User className="h-4 w-4 text-theme" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-theme">
                      Profil Saya
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100/50 my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="p-3 cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 rounded-xl transition-all group focus:bg-red-50"
                  >
                    <div className="h-8 w-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-colors">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="glass"
                  onClick={() => router.push("/login")}
                  className="font-semibold px-6 rounded-full"
                >
                  Masuk
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => router.push("/register")}
                  className="font-semibold px-6 rounded-full"
                >
                  Daftar
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center lg:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-theme hover:bg-theme-light transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-gradient-theme text-white shadow-lg"
                      : "text-gray-600 hover:bg-theme-light hover:text-theme"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${
                      active ? "bg-white/20" : "bg-theme-light"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-white" : "text-theme"
                      }`}
                    />
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user ? (
            <div className="pt-4 pb-6 border-t border-theme/10 px-4">
              <div className="flex items-center px-4 py-3 bg-gradient-theme-light rounded-xl mb-4 border border-white/40">
                <div className="shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-theme text-white font-bold text-lg">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-bold text-gray-800">
                    {user?.name}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-theme hover:bg-theme-light font-semibold py-6 rounded-xl transition-all"
                  onClick={() => {
                    router.push("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="h-8 w-8 rounded-lg bg-theme-light flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-theme" />
                  </div>
                  Profil Saya
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold py-6 rounded-xl transition-all"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  Keluar
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-6 border-t border-theme/10 px-4">
              <div className="space-y-3">
                <Button
                  variant="glass"
                  onClick={() => {
                    router.push("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full font-semibold py-6 rounded-xl"
                >
                  Masuk
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => {
                    router.push("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full font-semibold py-6 rounded-xl"
                >
                  Daftar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
