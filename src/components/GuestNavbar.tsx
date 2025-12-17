"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function GuestNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      aria-label="Guest navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-md border-b border-white/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <img
                src="/logo.png"
                alt="Red Calender Logo"
                className="h-12 w-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Red Calender
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {[
              { name: "Home", path: "/" },
              { name: "Fitur", path: "/#features" },
              { name: "Bantuan", path: "/help-center" },
            ].map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`font-medium text-base transition-all duration-300 rounded-full px-6 ${
                    isActive(item.path)
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-600 hover:bg-pink-50/50 hover:text-pink-600"
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <Link href="/login">
              <Button
                variant="ghost"
                className={`font-semibold text-base transition-all duration-300 rounded-full px-6 ${
                  isActive("/login")
                    ? "bg-pink-100 text-pink-600"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className={`font-bold text-base transition-all duration-300 rounded-full px-8 shadow-lg hover:shadow-pink-200/50 ${
                  isActive("/register")
                    ? "bg-linear-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800"
                    : "bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105"
                }`}
              >
                Daftar Gratis
              </Button>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-pink-50 rounded-full transition-colors"
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
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-pink-100 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-300 z-50 rounded-b-3xl overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                  <nav className="flex flex-col space-y-2">
                    {[
                      { name: "Home", path: "/" },
                      { name: "Fitur", path: "/#features" },
                      { name: "Bantuan", path: "/help-center" },
                      { name: "Masuk", path: "/login" },
                    ].map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start font-medium text-lg py-4 px-6 rounded-xl transition-colors ${
                            isActive(item.path)
                              ? "bg-pink-50 text-pink-600"
                              : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                          }`}
                        >
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button
                        className={`w-full justify-center font-bold text-lg py-6 rounded-xl shadow-lg mt-4 ${
                          isActive("/register")
                            ? "bg-linear-to-r from-pink-600 to-purple-700"
                            : "bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        }`}
                      >
                        Daftar Gratis Sekarang
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
