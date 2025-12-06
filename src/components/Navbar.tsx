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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-0">
        <div className="flex justify-between items-center h-20 lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Logo Section - Kiri */}
          <div className="flex items-center lg:pl-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-pink-400 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img
                  src="/logo.png"
                  alt="Red Calender Logo"
                  className="relative h-12 w-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-extrabold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
                  className={`group relative inline-flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    active ? "text-white" : "text-gray-700 hover:text-pink-600"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-linear-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg"></div>
                  )}
                  {!active && (
                    <div className="absolute inset-0 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <Icon
                    className={`relative h-4 w-4 mr-2 shrink-0 ${
                      active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-pink-600"
                    }`}
                  />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Kanan */}
          <div className="hidden lg:flex items-center justify-end lg:pr-6">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-auto p-2 rounded-full hover:bg-pink-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3 pr-2">
                      <Avatar className="h-11 w-11 border-2 border-pink-300 shadow-md ring-2 ring-pink-100 group-hover:ring-pink-200 transition-all">
                        <AvatarImage src="" alt={user?.name || "User"} />
                        <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-600 text-white font-bold text-base">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-800 leading-tight">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email?.substring(0, 30)}
                            {user?.email && user.email.length > 30 ? "..." : ""}
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-pink-600 transition-colors" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-72 border border-gray-100 shadow-2xl rounded-xl overflow-hidden"
                  align="end"
                  forceMount
                >
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="py-3.5 px-4 cursor-pointer hover:bg-pink-50 transition-all group"
                  >
                    <div className="h-9 w-9 rounded-xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center mr-3 transition-colors">
                      <User className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-pink-600">
                      Profil Saya
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="py-3.5 px-4 cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 transition-all group"
                  >
                    <div className="h-9 w-9 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-colors">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-semibold">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 transition-all font-semibold px-6 py-2.5 rounded-xl"
                >
                  Masuk
                </Button>
                <Button
                  variant="default"
                  onClick={() => router.push("/register")}
                  className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold px-6 py-2.5 rounded-xl border-0"
                >
                  Daftar
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center lg:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all"
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
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
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
                      ? "bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105 border border-pink-400"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${
                      active ? "bg-white/20" : "bg-pink-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-white" : "text-pink-600"
                      }`}
                    />
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user ? (
            <div className="pt-4 pb-4 border-t border-pink-100 px-4">
              <div className="flex items-center px-4 py-3 bg-linear-to-r from-pink-50 to-purple-50 rounded-xl mb-3">
                <div className="shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-pink-200">
                    <AvatarFallback className="bg-linear-to-br from-pink-400 to-purple-500 text-white font-bold text-lg">
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
                  className="w-full justify-start text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-semibold py-6 rounded-xl transition-all"
                  onClick={() => {
                    router.push("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-pink-600" />
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
            <div className="pt-4 pb-4 border-t border-pink-100 px-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 font-semibold py-6 rounded-xl transition-all"
                >
                  Masuk
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    router.push("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md font-semibold py-6 rounded-xl transition-all"
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
