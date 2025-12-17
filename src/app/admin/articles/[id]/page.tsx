"use client";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { PageLoading } from "@/components/ui/loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/admin/articles/${params.id}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (response.ok) {
          setArticle(data.article);
        } else {
          toast.error("Failed to fetch article");
        }
      } catch (error) {
        toast.error("Error fetching article");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <p className="text-gray-500">Article not found.</p>
        </div>
      </div>
    );
  }

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
                Edit Artikel 📝
              </h1>
              <p className="text-emerald-100 text-lg font-medium opacity-90 max-w-2xl">
                Perbarui konten edukasi untuk pengguna Anda
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
        <ArticleForm
          initialData={{
            id: article.id,
            title: article.title,
            content: article.content,
            categoryId: article.categoryId,
            thumbnail: article.thumbnail,
            published: article.published,
          }}
          isEditing
        />
      </div>
    </div>
  );
}
