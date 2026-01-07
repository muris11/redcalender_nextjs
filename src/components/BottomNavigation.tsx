"use client";

import { LoadingLink } from "@/components/ui/loading-link";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  FileText,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calender", label: "Kalender", icon: Calendar },
  { href: "/log", label: "Log", icon: Plus, isPrimary: true },
  { href: "/analysis", label: "Analisis", icon: TrendingUp },
];

const moreNavItems = [
  { href: "/education", label: "Edukasi", icon: BookOpen },
  { href: "/report", label: "Laporan", icon: FileText },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isMoreActive = moreNavItems.some(
    (item) =>
      pathname === item.href ||
      (pathname.startsWith(item.href) && item.href !== "/")
  );

  return (
    <>
      {/* Backdrop overlay saat submenu terbuka */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* Submenu popup */}
      {isMoreOpen && (
        <div className="fixed bottom-20 right-4 z-50 md:hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border/40 overflow-hidden min-w-[160px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-pink-50 dark:bg-pink-900/20">
              <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                Menu Lainnya
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 hover:bg-pink-100 dark:hover:bg-pink-800/30 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </button>
            </div>
            <div className="py-2">
              {moreNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (pathname.startsWith(item.href) && item.href !== "/");
                return (
                  <LoadingLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-all duration-200",
                      "hover:bg-pink-50 dark:hover:bg-pink-900/20",
                      isActive
                        ? "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isActive && "text-pink-600 dark:text-pink-400"
                      )}
                    />
                    <span className="text-sm">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-600 dark:bg-pink-400" />
                    )}
                  </LoadingLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className="
        fixed bottom-0 left-0 right-0 z-50 
        md:hidden
        
        /* Glass effect */
        bg-white/80 dark:bg-gray-900/80 
        backdrop-blur-xl backdrop-saturate-150
        border-t border-border/40
        
        /* Safe area */
        pb-[env(safe-area-inset-bottom)]
      "
      >
        <div className="flex justify-around items-end h-16 px-2">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/");

            if (item.isPrimary) {
              return (
                <LoadingLink
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center relative",
                    "py-2 px-3 rounded-xl",
                    "touch-manipulation",
                    "transition-all duration-300",
                    "active:scale-95",
                    "flex-1 max-w-[80px]",
                    isActive
                      ? "text-theme bg-theme-light -translate-y-1"
                      : "text-muted-foreground translate-y-0"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 mb-0.5",
                      "transition-transform duration-300",
                      isActive && "scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] whitespace-nowrap transition-all duration-300",
                      isActive ? "font-semibold text-theme" : "font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-theme animate-pulse" />
                  )}
                </LoadingLink>
              );
            }

            return (
              <LoadingLink
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center relative",
                  "py-2 px-3 rounded-xl",
                  "touch-manipulation",
                  "transition-all duration-300",
                  "active:scale-95",
                  "flex-1 max-w-[80px]",
                  isActive
                    ? "text-theme bg-theme-light -translate-y-1"
                    : "text-muted-foreground translate-y-0"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 mb-0.5",
                    "transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] whitespace-nowrap transition-all duration-300",
                    isActive ? "font-semibold text-theme" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-theme animate-pulse" />
                )}
              </LoadingLink>
            );
          })}

          {/* More/Lainnya Button */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              "flex flex-col items-center justify-center relative",
              "py-2 px-3 rounded-xl",
              "touch-manipulation",
              "transition-all duration-300",
              "active:scale-95",
              "flex-1 max-w-[80px]",
              isMoreActive || isMoreOpen
                ? "text-theme bg-theme-light -translate-y-1"
                : "text-muted-foreground translate-y-0"
            )}
          >
            <MoreHorizontal
              className={cn(
                "h-5 w-5 mb-0.5",
                "transition-transform duration-300",
                (isMoreActive || isMoreOpen) && "scale-110"
              )}
            />
            <span
              className={cn(
                "text-[10px] whitespace-nowrap transition-all duration-300",
                isMoreActive || isMoreOpen
                  ? "font-semibold text-theme"
                  : "font-medium"
              )}
            >
              Lainnya
            </span>
            {(isMoreActive || isMoreOpen) && (
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-theme animate-pulse" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
