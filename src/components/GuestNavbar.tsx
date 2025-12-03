"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function GuestNavbar() {
  const pathname = usePathname();
  useEffect(() => {
    console.log("GuestNavbar mounted", pathname);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      aria-label="Guest navigation"
      className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-pink-100 fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              <span className="text-2xl">🌸</span>
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
              Red Calendar
            </h1>
          </Link>

          <nav className="flex items-center space-x-3">
            <Link href="/">
              <Button
                variant="ghost"
                className={`font-semibold transition-all duration-300 ${
                  isActive("/")
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                🏠 Home
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                className={`font-semibold transition-all duration-300 ${
                  isActive("/login")
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                🔑 Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className={`font-semibold transition-all duration-300 border-0 shadow-md hover:shadow-lg ${
                  isActive("/register")
                    ? "bg-linear-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800"
                    : "bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                }`}
              >
                ✨ Daftar
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
