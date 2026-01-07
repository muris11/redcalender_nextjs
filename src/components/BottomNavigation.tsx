
"use client";

import { cn } from "@/lib/utils";
import { LoadingLink } from "@/components/ui/loading-link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Calendar, Plus, TrendingUp, BookOpen, FileText, User 
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calender", label: "Kalender", icon: Calendar },
  { href: "/log", label: "Log", icon: Plus, isPrimary: true },
  { href: "/analysis", label: "Analisis", icon: TrendingUp },
  { href: "/education", label: "Edukasi", icon: BookOpen },
  { href: "/report", label: "Laporan", icon: FileText },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-50 
      md:hidden
      
      /* Glass effect */
      bg-white/80 dark:bg-gray-900/80 
      backdrop-blur-xl backdrop-saturate-150
      border-t border-border/40
      
      /* Safe area */
      pb-[env(safe-area-inset-bottom)]
    ">
      {/* Scrollable container for many items */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex justify-start items-end h-16 px-1 min-w-max gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            
            if (item.isPrimary) {
              // Primary action button (exactly same style as others)
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
                    "min-w-[60px]",
                    isActive 
                      ? "text-theme bg-theme-light -translate-y-1" 
                      : "text-muted-foreground translate-y-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mb-0.5",
                    "transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] whitespace-nowrap transition-all duration-300",
                    isActive ? "font-semibold text-theme" : "font-medium"
                  )}>
                    {item.label}
                  </span>
                  {/* Active indicator dot */}
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
                  "min-w-[60px]",
                  isActive 
                    ? "text-theme bg-theme-light -translate-y-1" 
                    : "text-muted-foreground translate-y-0"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-0.5",
                  "transition-transform duration-300",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[10px] whitespace-nowrap transition-all duration-300",
                  isActive ? "font-semibold text-theme" : "font-medium"
                )}>
                  {item.label}
                </span>
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-theme animate-pulse" />
                )}
              </LoadingLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
