"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GuestFooter() {
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    console.log("GuestFooter mounted");
  }, []);

  return (
    <footer
      role="contentinfo"
      aria-label="Guest footer"
      className="bg-white border-t border-gray-200 mt-auto z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <span className="text-xl">🌸</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Red Calendar
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Platform pencatatan siklus menstruasi yang membantu Anda memahami
              kesehatan reproduksi dengan lebih baik. Privasi dan keamanan data
              Anda adalah prioritas kami.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                className="h-10 w-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="https://www.instagram.com"
                className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-pink-600" />
              </a>
              <a
                href="https://www.twitter.com"
                className="h-10 w-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Daftar
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Fitur
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              Bantuan & Info
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} Red Calendar. All rights reserved. Made with
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
