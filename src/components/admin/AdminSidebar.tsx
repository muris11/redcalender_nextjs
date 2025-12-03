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

export function AdminSidebar() {
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
        className={cn(
          "group relative flex items-center rounded-xl transition-all duration-200",
          isSubItem ? "px-4 py-2" : "px-4 py-3",
          route.active
            ? "bg-linear-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 shadow-lg shadow-pink-500/10"
            : "hover:bg-slate-800/50"
        )}
      >
        {/* Active indicator */}
        {route.active && (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-linear-to-b from-pink-500 to-purple-500 rounded-r-full",
              isSubItem ? "w-1 h-6" : "w-1 h-8"
            )}
          />
        )}

        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors",
              route.active
                ? "bg-pink-500/20 text-pink-400"
                : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-medium transition-colors",
              route.active
                ? "text-white"
                : "text-slate-300 group-hover:text-white",
              isSubItem && "text-sm"
            )}
          >
            {route.label}
          </div>
          <div
            className={cn(
              "text-xs transition-colors",
              route.active
                ? "text-pink-300"
                : "text-slate-500 group-hover:text-slate-400",
              isSubItem && route.active && "text-pink-300",
              isSubItem &&
                !route.active &&
                "text-slate-600 group-hover:text-slate-500"
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
                ? "text-pink-400 translate-x-1"
                : "text-slate-500 group-hover:text-slate-400"
            )}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-white/10">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {/* Main Routes */}
          {mainRoutes.map((route) => (
            <NavLink key={route.href} route={route} />
          ))}

          {/* Articles Section */}
          <div className="mt-6">
            <button
              onClick={() => setIsArticlesOpen(!isArticlesOpen)}
              className="w-full group relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800/50"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white">
                <FileText className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium text-slate-300 group-hover:text-white transition-colors">
                  Artikel
                </div>
                <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  Manajemen Konten
                </div>
              </div>

              {/* Chevron */}
              {isArticlesOpen ? (
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-400 transition-all duration-200" />
              )}
            </button>

            {/* Sub-menu */}
            {isArticlesOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {articleRoutes.map((route) => (
                  <NavLink key={route.href} route={route} isSubItem />
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Sistem Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
