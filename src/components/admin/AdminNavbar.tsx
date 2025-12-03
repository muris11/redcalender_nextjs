"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminNavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AdminNavbar({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [viewedNotificationIds, setViewedNotificationIds] = useState<
    Set<string>
  >(new Set());

  const handleLogout = () => {
    logout();
  };

  // Mark notifications as viewed when dropdown opens
  const handleNotificationDropdownOpen = (open: boolean) => {
    if (open && notificationCount > 0) {
      // Mark all current notifications as viewed
      const newViewedIds = new Set(viewedNotificationIds);
      notifications.forEach((notification) => {
        newViewedIds.add(notification.id);
      });
      setViewedNotificationIds(newViewedIds);
      setNotificationCount(0);
    }
  };

  // Mark individual notification as viewed
  const markNotificationAsViewed = (notificationId: string) => {
    const newViewedIds = new Set(viewedNotificationIds);
    newViewedIds.add(notificationId);
    setViewedNotificationIds(newViewedIds);

    // Update notification count
    const remainingUnread = notifications.filter(
      (n) =>
        !newViewedIds.has(n.id) &&
        new Date(n.timestamp || n.time) >
          new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;
    setNotificationCount(remainingUnread);
  };

  // Fetch recent activities for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/admin/activities?limit=5");
        if (response.ok) {
          const data = await response.json();
          const activities = data.activities || [];
          setNotifications(activities);

          // Count activities from last 24 hours that haven't been viewed
          const recentActivities =
            activities.filter((activity: any) => {
              const activityTime = new Date(
                activity.timestamp || activity.time
              );
              const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
              return (
                activityTime > oneDayAgo &&
                !viewedNotificationIds.has(activity.id)
              );
            }) || [];

          setNotificationCount(recentActivities.length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [viewedNotificationIds]);

  return (
    <nav className="shadow-lg border-b border-white/20 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileMenuToggle}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-colors duration-200"
              >
                <span className="sr-only">Buka menu utama</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Logo - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex md:items-center md:ml-4">
              <div className="flex items-center space-x-3">
                {/* Emoji */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg">
                    <span className="text-lg">🌸</span>
                  </div>
                </div>

                {/* Red Admin */}
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Red Admin
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Notifications */}
            <DropdownMenu onOpenChange={handleNotificationDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg relative"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none text-gray-900">
                      Aktivitas Terbaru
                    </p>
                    {notificationCount > 0 && (
                      <span className="text-xs text-gray-500">
                        {notificationCount} baru
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          markNotificationAsViewed(notification.id)
                        }
                      >
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.user}
                          </p>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.action}
                          {notification.details?.title && (
                            <span className="font-medium">
                              {" "}
                              "{notification.details.title}"
                            </span>
                          )}
                          {notification.details?.date && (
                            <span className="text-gray-500">
                              {" "}
                              ({notification.details.date})
                            </span>
                          )}
                        </p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Tidak ada aktivitas terbaru</p>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown */}
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-white/50 transition-colors duration-200"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-pink-500/20">
                    <AvatarImage src="" alt={user?.name || "Admin"} />
                    <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-600 text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Selamat datang kembali
                    </p>
                    <p className="text-sm font-semibold leading-none text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Administrator
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer mx-2 rounded-md"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile User Info and Logout */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <DropdownMenu onOpenChange={handleNotificationDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg relative p-2"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none text-gray-900">
                      Aktivitas Terbaru
                    </p>
                    {notificationCount > 0 && (
                      <span className="text-xs text-gray-500">
                        {notificationCount} baru
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          markNotificationAsViewed(notification.id)
                        }
                      >
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                            {notification.user}
                          </p>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate w-full">
                          {notification.action}
                        </p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      <p className="text-xs">Tidak ada aktivitas</p>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile User Info */}
            <div className="flex flex-col items-end min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>

            {/* Mobile Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg p-2"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
