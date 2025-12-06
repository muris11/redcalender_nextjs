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
    window.location.href = "/";
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
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-0">
        <div className="flex justify-between items-center h-20 lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Logo Section - Kiri */}
          <div className="flex items-center lg:pl-6">
            {/* Mobile menu button */}
            <div className="lg:hidden mr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileMenuToggle}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all"
              >
                <span className="sr-only">Buka menu utama</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3 group">
                <div className="relative hidden lg:block">
                  <div className="absolute inset-0 bg-linear-to-r from-pink-400 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <img
                    src="/logo.png"
                    alt="RedCalender Admin Logo"
                    className="relative h-12 w-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-base lg:text-2xl font-extrabold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  RedCalender Admin
                </span>
              </div>
            </div>
          </div>

          {/* Center Content - Desktop Only */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-2 px-4 py-2 bg-pink-50 rounded-xl">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">
                Dashboard Admin Aktif
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Kanan */}
          <div className="hidden lg:flex items-center justify-end space-x-4 lg:pr-6">
            {/* Notifications */}
            <DropdownMenu onOpenChange={handleNotificationDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-pink-50 transition-all"
                >
                  <Bell className="h-5 w-5 text-gray-600 hover:text-pink-600 transition-colors" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
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

            {/* User Info Display - Desktop */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-pink-50 rounded-xl">
              <Avatar className="h-10 w-10 border-2 border-pink-300 shadow-sm">
                <AvatarImage src="" alt={user?.name || "Admin"} />
                <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-600 text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 leading-tight">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.email?.substring(0, 25)}
                  {user?.email && user.email.length > 25 ? "..." : ""}
                </span>
                <span className="text-xs font-semibold text-pink-600 mt-0.5">
                  Administrator
                </span>
              </div>
            </div>

            {/* Logout Button - Desktop */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="h-10 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-semibold transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>

          {/* Mobile User Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <DropdownMenu onOpenChange={handleNotificationDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-pink-50 transition-all"
                >
                  <Bell className="h-5 w-5 text-gray-600 hover:text-pink-600 transition-colors" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none text-gray-900">
                      Aktivitas Terbaru
                    </p>
                    {notificationCount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-48 overflow-y-auto space-y-2 p-3">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => {
                          markNotificationAsViewed(notification.id);
                          handleNotificationDropdownOpen(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-900 truncate flex-1">
                            {notification.user}
                          </p>
                          <span className="text-xs text-gray-500 ml-2">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {notification.action}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-3">
                      Tidak ada aktivitas
                    </p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Profile Dropdown */}
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-pink-50 transition-all"
                >
                  <Avatar className="h-10 w-10 border-2 border-pink-300 shadow-sm">
                    <AvatarImage src="" alt={user?.name || "Admin"} />
                    <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-600 text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 mt-2" align="end" forceMount>
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal p-4 bg-linear-to-r from-pink-50 to-purple-50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-pink-300">
                      <AvatarImage src="" alt={user?.name || "Admin"} />
                      <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-600 text-white font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      <span className="text-xs font-semibold text-pink-600 mt-1">
                        Administrator
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer mx-2 my-2 rounded-lg py-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
