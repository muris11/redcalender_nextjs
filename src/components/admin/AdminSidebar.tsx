"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  active: boolean;
  description: string;
}

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isArticlesOpen, setIsArticlesOpen] = useState(
    pathname.startsWith("/admin/articles") ||
      pathname.startsWith("/admin/categories")
  );

  const mainRoutes: NavItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
      description: "Ringkasan & Analitik",
    },
    {
      label: "Pengguna",
      icon: Users,
      href: "/admin/users",
      active: pathname.startsWith("/admin/users"),
      description: "Kelola Pengguna",
    },
  ];

  const articleRoutes: NavItem[] = [
    {
      label: "Kelola Artikel",
      href: "/admin/articles",
      active:
        pathname.startsWith("/admin/articles") &&
        !pathname.includes("/new") &&
        !pathname.includes("/categories"),
      description: "Buat & Edit Artikel",
    },
    {
      label: "Kelola Kategori Artikel",
      href: "/admin/categories",
      active: pathname.startsWith("/admin/categories"),
      description: "Kategori Artikel",
    },
  ];

  const NavLink = ({
    route,
    isSubItem = false,
  }: {
    route: NavItem;
    isSubItem?: boolean;
  }) => {
    const Icon = route.icon;

    return (
      <Link
        href={route.href}
        onClick={onNavigate}
        className={cn(
          "group relative flex items-center rounded-xl transition-all duration-200",
          isSubItem ? "px-3 lg:px-4 py-2" : "px-3 lg:px-4 py-2.5 lg:py-3",
          route.active
            ? "bg-linear-to-r from-pink-500 to-purple-600 shadow-lg"
            : "hover:bg-pink-50"
        )}
      >
        {/* Active indicator */}
        {route.active && (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full",
              isSubItem ? "w-1 h-6" : "w-1 h-8"
            )}
          />
        )}

        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-lg mr-2.5 lg:mr-3 transition-colors",
              isSubItem ? "w-8 h-8 lg:w-9 lg:h-9" : "w-9 h-9 lg:w-10 lg:h-10",
              route.active
                ? "bg-white/20 text-white"
                : "bg-pink-100 text-pink-600 group-hover:bg-pink-200"
            )}
          >
            <Icon
              className={cn(isSubItem ? "h-4 w-4" : "h-4 w-4 lg:h-5 lg:w-5")}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-semibold transition-colors",
              route.active
                ? "text-white"
                : "text-gray-800 group-hover:text-pink-600",
              isSubItem ? "text-sm" : "text-sm lg:text-base"
            )}
          >
            {route.label}
          </div>
          <div
            className={cn(
              "text-xs transition-colors hidden lg:block",
              route.active
                ? "text-pink-100"
                : "text-gray-500 group-hover:text-pink-500"
            )}
          >
            {route.description}
          </div>
        </div>

        {/* Chevron for main items */}
        {!isSubItem && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-all duration-200",
              route.active
                ? "text-white translate-x-1"
                : "text-gray-500 group-hover:text-pink-500"
            )}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-pink-50 via-purple-50 to-pink-50 shadow-xl border-r border-pink-100">
      {/* Header - Mobile Only */}
      <div className="lg:hidden px-4 py-4 border-b border-pink-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-pink-400 to-purple-500 rounded-full blur-md opacity-30"></div>
            <img
              src="/logo.png"
              alt="RedCalender Admin"
              className="relative h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              RedCalender Admin
            </h2>
            <p className="text-xs text-gray-500">Dashboard Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 overflow-y-auto">
        <div className="space-y-1 lg:space-y-2">
          {/* Main Routes */}
          {mainRoutes.map((route) => (
            <NavLink key={route.href} route={route} />
          ))}

          {/* Articles Section */}
          <div className="mt-4 lg:mt-6">
            {/* Desktop: Collapsible menu */}
            <div className="hidden lg:block">
              <button
                onClick={() => setIsArticlesOpen(!isArticlesOpen)}
                className="w-full group relative flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 hover:bg-pink-50"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-lg mr-2.5 lg:mr-3 transition-colors bg-pink-100 text-pink-600 group-hover:bg-pink-200">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm lg:text-base font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                    Artikel
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-pink-500 transition-colors hidden lg:block">
                    Manajemen Konten
                  </div>
                </div>

                {/* Chevron */}
                {isArticlesOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-pink-600 transition-colors" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-pink-500 transition-all duration-200" />
                )}
              </button>

              {/* Sub-menu */}
              {isArticlesOpen && (
                <div className="ml-4 lg:ml-6 mt-1 lg:mt-2 space-y-1">
                  {articleRoutes.map((route) => (
                    <NavLink key={route.href} route={route} isSubItem />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile: Direct navigation links */}
            <div className="lg:hidden space-y-1">
              <Link
                href="/admin/articles"
                onClick={onNavigate}
                className={cn(
                  "group relative flex items-center rounded-xl transition-all duration-200 px-3 py-2.5",
                  pathname.startsWith("/admin/articles") &&
                    !pathname.includes("/categories")
                    ? "bg-linear-to-r from-pink-500 to-purple-600 shadow-lg"
                    : "hover:bg-pink-50"
                )}
              >
                {/* Active indicator */}
                {pathname.startsWith("/admin/articles") &&
                  !pathname.includes("/categories") && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full w-1 h-8" />
                  )}

                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg mr-2.5 transition-colors",
                    pathname.startsWith("/admin/articles") &&
                      !pathname.includes("/categories")
                      ? "bg-white/20 text-white"
                      : "bg-pink-100 text-pink-600 group-hover:bg-pink-200"
                  )}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      pathname.startsWith("/admin/articles") &&
                        !pathname.includes("/categories")
                        ? "text-white"
                        : "text-gray-800 group-hover:text-pink-600"
                    )}
                  >
                    Kelola Artikel
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    pathname.startsWith("/admin/articles") &&
                      !pathname.includes("/categories")
                      ? "text-white translate-x-1"
                      : "text-gray-500 group-hover:text-pink-500"
                  )}
                />
              </Link>

              <Link
                href="/admin/categories"
                onClick={onNavigate}
                className={cn(
                  "group relative flex items-center rounded-xl transition-all duration-200 px-3 py-2.5",
                  pathname.startsWith("/admin/categories")
                    ? "bg-linear-to-r from-pink-500 to-purple-600 shadow-lg"
                    : "hover:bg-pink-50"
                )}
              >
                {/* Active indicator */}
                {pathname.startsWith("/admin/categories") && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full w-1 h-8" />
                )}

                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg mr-2.5 transition-colors",
                    pathname.startsWith("/admin/categories")
                      ? "bg-white/20 text-white"
                      : "bg-pink-100 text-pink-600 group-hover:bg-pink-200"
                  )}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      pathname.startsWith("/admin/categories")
                        ? "text-white"
                        : "text-gray-800 group-hover:text-pink-600"
                    )}
                  >
                    Kelola Kategori
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    pathname.startsWith("/admin/categories")
                      ? "text-white translate-x-1"
                      : "text-gray-500 group-hover:text-pink-500"
                  )}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-100">
        <div className="bg-linear-to-r from-pink-50 to-purple-50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">
              Sistem Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
