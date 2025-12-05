"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function GuestNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
            <h1 className="text-lg md:text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Red Calendar
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-3">
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

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl hover:bg-pink-50 hover:shadow-md transition-all duration-300 border border-pink-200/50 hover:border-pink-300">
                <MenuIcon className="h-6 w-6 text-pink-600" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] bg-white/95 backdrop-blur-xl border-l border-pink-200 shadow-2xl"
            >
              <SheetHeader className="border-b border-pink-100 pb-4 mb-6">
                <SheetTitle className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
                    <span className="text-lg">🌸</span>
                  </div>
                  Red Calendar
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-semibold transition-all duration-300 rounded-xl py-4 px-4 h-auto text-left group ${
                      isActive("/")
                        ? "bg-pink-100 text-pink-700 shadow-md border border-pink-200"
                        : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:shadow-sm hover:border hover:border-pink-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        🏠
                      </span>
                      <span className="flex-1">Home</span>
                      {isActive("/") && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-semibold transition-all duration-300 rounded-xl py-4 px-4 h-auto text-left group ${
                      isActive("/login")
                        ? "bg-pink-100 text-pink-700 shadow-md border border-pink-200"
                        : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:shadow-sm hover:border hover:border-pink-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        🔑
                      </span>
                      <span className="flex-1">Masuk</span>
                      {isActive("/login") && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className={`w-full justify-start font-semibold transition-all duration-300 rounded-xl py-4 px-4 h-auto text-left group border-2 shadow-lg hover:shadow-xl ${
                      isActive("/register")
                        ? "bg-linear-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white border-pink-600"
                        : "bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-pink-500 hover:border-pink-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                        ✨
                      </span>
                      <span className="flex-1">Daftar</span>
                      {isActive("/register") && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </Button>
                </Link>
              </nav>
              <div className="mt-8 pt-6 border-t border-pink-100">
                <p className="text-sm text-gray-500 text-center">
                  Selamat datang di Red Calendar 🌸
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
