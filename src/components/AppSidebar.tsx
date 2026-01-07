"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { LoadingLink } from "@/components/ui/loading-link";
import { useTheme } from "@/components/ThemeProvider";
import { useAuthStore } from "@/store/authStore";
import {
  BookOpen,
  Calendar,
  ChevronUp,
  FileText,
  LayoutDashboard,
  LogOut,
  Palette,
  Plus,
  TrendingUp,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calender", label: "Kalender", icon: Calendar },
  { href: "/log", label: "Log Harian", icon: Plus },
  { href: "/analysis", label: "Analisis", icon: TrendingUp },
  { href: "/education", label: "Edukasi", icon: BookOpen },
  { href: "/report", label: "Laporan", icon: FileText },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();

  const getThemeInfo = () => {
    switch (theme) {
      case "kucing":
        return { emoji: "🐱", label: "Kucing", color: "text-pink-500" };
      case "gajah":
        return { emoji: "🐘", label: "Gajah", color: "text-purple-500" };
      case "unicorn":
        return { emoji: "🦄", label: "Unicorn", color: "text-teal-500" };
      case "sapi":
        return { emoji: "🐄", label: "Sapi", color: "text-gray-700" };
      default:
        return { emoji: "🐱", label: "Kucing", color: "text-pink-500" };
    }
  };

  const themeInfo = getThemeInfo();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Sidebar 
      variant="inset" 
      collapsible="icon"
      className="hidden md:flex border-r border-border/40"
    >
      {/* Header - Logo */}
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center justify-center px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <LoadingLink href="/dashboard" className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-theme rounded-xl blur-md opacity-40"></div>
                  <img
                    src="/logo.png"
                    alt="Red Calender"
                    className="relative h-8 w-8 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-gradient">
                    Red Calender
                  </span>
                  <span className="text-xs font-medium text-muted-foreground/80 tracking-wide">
                    Kesehatan Wanita
                  </span>
                </div>
              </LoadingLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="overflow-hidden scrollbar-none">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-gradient-theme text-white hover:opacity-90 shadow-md h-12"
                          : "hover:bg-theme-light hover:text-theme text-foreground h-12"
                      }
                    >
                      <LoadingLink href={item.href} className="flex items-center gap-3 px-3">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-white" : ""}`} />
                        <span className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>{item.label}</span>
                      </LoadingLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-border/40 my-2" />

        {/* Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/profile"}
                  tooltip="Profil Saya"
                  className={
                    pathname === "/profile"
                      ? "bg-gradient-theme text-white hover:opacity-90 shadow-md h-12"
                      : "hover:bg-theme-light hover:text-theme text-foreground h-12"
                  }
                >
                  <LoadingLink href="/profile" className="flex items-center gap-3 px-3">
                    <User
                      className={`h-5 w-5 ${pathname === "/profile" ? "text-white" : ""}`}
                    />
                    <span className={`text-sm font-medium ${pathname === "/profile" ? "text-white" : ""}`}>Profil Saya</span>
                  </LoadingLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Theme Indicator */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={`Tema: ${themeInfo.label}`}
                  className="hover:bg-theme-light text-foreground h-12"
                >
                  <LoadingLink href="/profile" className="flex items-center gap-3 px-3">
                    <Palette className="h-5 w-5 text-theme" />
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-lg">{themeInfo.emoji}</span>
                      <span>Tema: {themeInfo.label}</span>
                    </span>
                  </LoadingLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User Profile & Logout */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-theme-light"
                >
                  <Avatar className="h-8 w-8 rounded-lg border-2 border-theme/20">
                    <AvatarImage src="" alt={user?.name || "User"} />
                    <AvatarFallback className="rounded-lg bg-gradient-theme text-white font-bold text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground">
                      {user?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl glass-card border-white/20"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="p-3 cursor-pointer hover:bg-theme-light rounded-lg transition-all group focus:bg-theme-light"
                >
                  <div className="h-8 w-8 rounded-lg bg-theme-light group-hover:bg-theme/20 flex items-center justify-center mr-3 transition-colors">
                    <User className="h-4 w-4 text-theme" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-theme">
                    Profil Saya
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="p-3 cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 rounded-lg transition-all group focus:bg-red-50"
                >
                  <div className="h-8 w-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-colors">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-medium">Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for collapse/expand */}
      <SidebarRail />
    </Sidebar>
  );
}
