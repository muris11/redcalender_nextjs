"use client";

import { ArticleForm } from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-0 mb-8 p-8 text-white shadow-2xl shadow-emerald-500/20 border border-white/10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm">
                Artikel Baru 📝
              </h1>
              <p className="text-emerald-100 text-lg font-medium opacity-90 max-w-2xl">
                Buat artikel edukatif baru untuk pengguna Anda
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <ArticleForm />
      </div>
    </div>
  );
}
