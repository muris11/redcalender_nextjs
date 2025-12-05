"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
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
            <img
              src="/logo.png"
              alt="Red Calendar Logo"
              className="h-15 w-15 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-lg md:text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Red Calender
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
                Home
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
                Masuk
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
                Daftar
              </Button>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-pink-50 rounded-md transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-700" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
              />
              {/* Menu */}
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-lg md:hidden animate-in slide-in-from-top-2 duration-300 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <nav className="flex flex-col space-y-2">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start font-medium py-3 px-4 rounded-lg transition-colors ${
                          isActive("/")
                            ? "bg-pink-50 text-pink-600 border border-pink-200"
                            : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                        }`}
                      >
                        Home
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start font-medium py-3 px-4 rounded-lg transition-colors ${
                          isActive("/login")
                            ? "bg-pink-50 text-pink-600 border border-pink-200"
                            : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                        }`}
                      >
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className={`w-full justify-start font-medium py-3 px-4 rounded-lg border-2 shadow-sm transition-all ${
                          isActive("/register")
                            ? "bg-linear-to-r from-pink-600 to-purple-700 text-white border-pink-600"
                            : "bg-linear-to-r from-pink-500 to-purple-600 text-white border-pink-500 hover:from-pink-600 hover:to-purple-700 hover:border-pink-600"
                        }`}
                      >
                        Daftar
                      </Button>
                    </Link>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
