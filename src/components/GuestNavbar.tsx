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
              <img
                src="/logo.png"
                alt="Red Calendar Logo"
                className="h-6 w-6 object-contain"
              />
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
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-pink-50 rounded-md transition-colors"
              >
                <MenuIcon className="h-6 w-6 text-gray-700" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[350px] bg-white/95 backdrop-blur-md border-l border-pink-200"
            >
              <SheetHeader className="border-b border-pink-100 pb-4 mb-4">
                <SheetTitle className="text-pink-600 font-bold">
                  Menu Navigasi
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-medium py-3 px-4 rounded-lg ${
                      isActive("/")
                        ? "bg-pink-50 text-pink-600 border border-pink-200"
                        : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                    }`}
                  >
                    🏠 Home
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start font-medium py-3 px-4 rounded-lg ${
                      isActive("/login")
                        ? "bg-pink-50 text-pink-600 border border-pink-200"
                        : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                    }`}
                  >
                    🔑 Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className={`w-full justify-start font-medium py-3 px-4 rounded-lg border-2 shadow-sm ${
                      isActive("/register")
                        ? "bg-linear-to-r from-pink-600 to-purple-700 text-white border-pink-600"
                        : "bg-linear-to-r from-pink-500 to-purple-600 text-white border-pink-500 hover:from-pink-600 hover:to-purple-700 hover:border-pink-600"
                    }`}
                  >
                    ✨ Daftar
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
