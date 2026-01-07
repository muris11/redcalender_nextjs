"use client";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export function GuestFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-auto relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-pink-100/50 dark:bg-pink-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-[100px] w-[300px] h-[300px] bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-900 p-2.5 rounded-xl border border-pink-100 dark:border-pink-900/30 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Red Calender Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <Heading variant="h4" className="text-gray-900 dark:text-white font-bold tracking-tight">
                Red Calender
              </Heading>
            </div>
            <Text variant="body-sm" className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Platform kesehatan wanita terpercaya untuk memantau siklus menstruasi, masa subur, dan kesehatan reproduksi dengan teknologi AI.
            </Text>
            <div className="flex gap-4 pt-2">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "Youtube" },
              ].map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href} 
                  className="bg-gray-50 dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900/30 text-gray-400 hover:text-pink-600 transition-all duration-300 p-2.5 rounded-full"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-2 lg:pl-12">
            <div>
              <Heading variant="label-lg" className="mb-6 text-gray-900 dark:text-white font-semibold">
                Produk
              </Heading>
              <ul className="space-y-4">
                {[
                  { label: "Fitur Unggulan", href: "/#features" },
                  { label: "Pusat Bantuan", href: "/help-center" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 text-sm transition-colors duration-200 block py-1">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Heading variant="label-lg" className="mb-6 text-gray-900 dark:text-white font-semibold">
                Perusahaan
              </Heading>
              <ul className="space-y-4">
                {[
                  { label: "Kontak", href: "/contact" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 text-sm transition-colors duration-200 block py-1">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <Heading variant="label-lg" className="mb-6 text-gray-900 dark:text-white font-semibold">
              Legal & Privasi
            </Heading>
            <ul className="space-y-4 mb-8">
              {[
                { label: "Kebijakan Privasi", href: "/privacy-policy" },
                { label: "Syarat & Ketentuan", href: "/terms" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 text-sm transition-colors duration-200 block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="bg-pink-50 dark:bg-pink-900/10 rounded-xl p-4 border border-pink-100 dark:border-pink-900/20">
              <Text variant="label-sm" className="text-pink-800 dark:text-pink-300 mb-1">Butuh Bantuan?</Text>
              <Link href="mailto:support@redcalender.com" className="text-pink-600 dark:text-pink-400 hover:underline font-medium text-sm">
                support@redcalender.com
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Text variant="body-sm" className="text-gray-400 text-center md:text-left">
            © {currentYear} Red Calender. Hak cipta dilindungi undang-undang.
          </Text>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Dibuat dengan</span>
            <span className="text-pink-500 animate-pulse">❤️</span>
            <span>untuk wanita Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
