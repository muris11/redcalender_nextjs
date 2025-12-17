"use client";

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

export default function GuestFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Guest footer"
      className="bg-white border-t border-pink-100 mt-auto z-10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-pink-400 via-purple-500 to-pink-400"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-200">
                <span className="text-2xl">🌸</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Red Calender
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Platform pencatatan siklus menstruasi yang membantu Anda memahami
              kesehatan reproduksi dengan lebih baik. Privasi dan keamanan data
              Anda adalah prioritas kami.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100" },
                { icon: Instagram, color: "text-pink-600", bg: "bg-pink-50 hover:bg-pink-100" },
                { icon: Twitter, color: "text-sky-500", bg: "bg-sky-50 hover:bg-sky-100" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`h-10 w-10 rounded-full ${social.bg} flex items-center justify-center transition-all duration-300 hover:scale-110`}
                >
                  <social.icon className={`h-5 w-5 ${social.color}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Tautan Cepat</h3>
            <ul className="space-y-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Fitur", href: "/#features" },
                { name: "Login", href: "/login" },
                { name: "Daftar", href: "/register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-pink-600 transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Bantuan & Info</h3>
            <ul className="space-y-4">
              {[
                { name: "Pusat Bantuan", href: "/help-center" },
                { name: "Kebijakan Privasi", href: "/privacy-policy" },
                { name: "Syarat & Ketentuan", href: "/terms" },
                { name: "Hubungi Kami", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-pink-600 transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin className="h-5 w-5 text-pink-500 shrink-0 mt-1" />
                <span>Jl. Teknologi No. 123, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail className="h-5 w-5 text-pink-500 shrink-0" />
                <a href="mailto:support@redcalender.com" className="hover:text-pink-600 transition-colors">
                  support@redcalender.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone className="h-5 w-5 text-pink-500 shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-pink-600 transition-colors">
                  +62 812 3456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} Red Calender. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <span className="text-red-500 animate-pulse">❤</span> for women's health
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
