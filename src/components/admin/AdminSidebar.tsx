"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    Tags,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  active: boolean;
  description: string;
  children?: NavItem[];
}

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

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

  const contentRoutes: NavItem[] = [
    {
      label: "Artikel",
      icon: FileText,
      href: "/admin/articles",
      active: pathname.startsWith("/admin/articles"),
      description: "Buat & Edit Artikel",
    },
    {
      label: "Kategori",
      icon: Tags,
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
          "group relative flex items-center rounded-xl transition-all duration-300 ease-in-out",
          isSubItem ? "px-3 lg:px-4 py-2" : "px-3 lg:px-4 py-3",
          route.active
            ? "bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-500/20 translate-x-1"
            : "hover:bg-pink-50 hover:translate-x-1"
        )}
      >
        {/* Active indicator */}
        {route.active && (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-r-full shadow-sm",
              isSubItem ? "w-1 h-6" : "w-1 h-8"
            )}
          />
        )}

        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-lg mr-3 transition-all duration-300",
              isSubItem ? "w-8 h-8" : "w-10 h-10",
              route.active
                ? "bg-white/20 text-white shadow-inner"
                : "bg-white text-pink-500 shadow-sm group-hover:bg-pink-100 group-hover:scale-110"
            )}
          >
            <Icon
              className={cn(isSubItem ? "h-4 w-4" : "h-5 w-5")}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-bold transition-colors",
              route.active
                ? "text-white"
                : "text-slate-700 group-hover:text-pink-700",
              isSubItem ? "text-sm" : "text-sm lg:text-base"
            )}
          >
            {route.label}
          </div>
          <div
            className={cn(
              "text-xs transition-colors hidden lg:block truncate",
              route.active
                ? "text-pink-100/90"
                : "text-slate-400 group-hover:text-pink-500/80"
            )}
          >
            {route.description}
          </div>
        </div>

        {/* Chevron for main items */}
        {!isSubItem && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-all duration-300",
              route.active
                ? "text-white translate-x-1 opacity-100"
                : "text-slate-300 group-hover:text-pink-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
            )}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent pb-4">
      <div className="space-y-6 px-4 py-6">
        {/* Main Section */}
        <div>
          <h3 className="mb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Utama
          </h3>
          <div className="space-y-2">
            {mainRoutes.map((route) => (
              <NavLink key={route.href} route={route} />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h3 className="mb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Konten
          </h3>
          <div className="space-y-2">
            {contentRoutes.map((route) => (
              <NavLink key={route.href} route={route} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
