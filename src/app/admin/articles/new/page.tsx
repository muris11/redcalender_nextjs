"use client";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { Plus } from "lucide-react";

export default function NewArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Plus className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Artikel Baru</h1>
              <p className="text-pink-100 text-lg">
                Buat artikel baru untuk dibagikan kepada pengguna
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <ArticleForm />
        </div>
      </div>
    </div>
  );
}
