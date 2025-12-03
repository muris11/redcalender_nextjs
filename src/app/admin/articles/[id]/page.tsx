"use client";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { PageLoading } from "@/components/ui/loading";
import { Edit } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Edit className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Edit Artikel</h1>
              <p className="text-pink-100 text-lg">
                Perbarui artikel yang sudah ada
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
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
    </div>
  );
}
