"use client";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function GuestNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      aria-label="Guest navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm py-2"
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/logo.png"
                alt="Red Calender Logo"
                className="h-9 w-9 md:h-11 md:w-11 object-contain transition-transform duration-300 group-hover:scale-110 relative z-10"
              />
            </div>
            <span className="font-extrabold text-xl md:text-2xl tracking-tight text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">
              Red<span className="text-pink-600">Calender</span>
            </span>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/40 dark:border-gray-700/50 shadow-sm ring-1 ring-gray-900/5">
              {[
                { name: "Home", path: "/" },
                { name: "Fitur", path: "/#features" },
                { name: "Bantuan", path: "/help-center" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-5 py-2 rounded-full transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-white dark:bg-gray-700 shadow-sm text-pink-600"
                      : "text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Text
                    variant="body-sm"
                    className="font-medium"
                  >
                    {item.name}
                  </Text>
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center gap-3 pl-4">
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 font-medium px-4"
              asChild
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button 
              className="rounded-full px-6 bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-lg shadow-pink-200/50 hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-0.5 hover-glow"
              asChild
            >
              <Link href="/register">Daftar Gratis</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XIcon className="h-6 w-6 transition-transform duration-300 rotate-90" />
            ) : (
              <MenuIcon className="h-6 w-6 transition-transform duration-300" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Mobile Menu Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/70 z-[9998] md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Mobile Menu Drawer */}
          <div
            className={`fixed inset-y-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl md:hidden z-[9999] transform transition-transform duration-300 ease-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Red Calender Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-extrabold text-xl tracking-tight text-pink-600">
                    Red Calender
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {[
                  { name: "Home", path: "/" },
                  { name: "Fitur", path: "/#features" },
                  { name: "Bantuan", path: "/help-center" },
                ].map((item, index) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <div
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Text variant="body-lg" className="font-medium">
                        {item.name}
                      </Text>
                      {isActive(item.path) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-600"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-center h-12 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-lg"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button 
                  className="w-full h-12 rounded-xl bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-lg shadow-pink-200/50 font-semibold text-lg active:scale-95 transition-all"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/register">Daftar Gratis Sekarang</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
