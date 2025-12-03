"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageLoading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import {
  Apple,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Filter,
  Heart,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  publishedAt?: string;
  authorName?: string;
  excerpt?: string;
  readTime?: number;
  tags?: string[];
}

export default function EducationContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string; color: string }>
  >([]);
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string>>({});
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load articles and categories from API
    loadArticles();
    loadCategories();
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Filter articles based on search and category
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category.slug === selectedCategory
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory]);

  const loadArticles = async () => {
    try {
      setIsDataLoading(true);
      setError(null);

      const response = await fetch("/api/admin/articles");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Check if articles exist
      if (!data.articles || !Array.isArray(data.articles)) {
        console.warn("No articles found in response");
        setArticles([]);
        return;
      }

      // Transform API data to match our interface
      const transformedArticles: Article[] = data.articles.map(
        (article: any) => ({
          ...article,
          publishedAt: article.createdAt, // Map createdAt to publishedAt for compatibility
          authorName: article.author?.name || "Admin", // Map author name with fallback
          excerpt: article.content?.substring(0, 150) + "..." || "", // Create excerpt from content
          readTime: Math.ceil((article.content?.length || 0) / 1000), // Rough estimate: 1000 chars = 1 minute
          tags: [], // TODO: Add tags field to database if needed
        })
      );

      setArticles(transformedArticles);
      // fetch signed urls for any thumbnails that are storage paths
      fetchSignedUrls(transformedArticles || []);
    } catch (error) {
      console.error("Error loading articles:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(`Gagal memuat artikel: ${errorMessage}`);
      toast.error(`Gagal memuat artikel: ${errorMessage}`);
      // Fallback to empty array if API fails
      setArticles([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchSignedUrls = async (list: Article[]) => {
    if (!list || list.length === 0) return;
    const toFetch = list.filter(
      (a) => a.thumbnail && !/^https?:\/\//i.test(a.thumbnail)
    );
    if (toFetch.length === 0) return;

    const fetches = toFetch.map(async (article) => {
      try {
        const res = await fetch(
          `/api/admin/upload/signed?path=${encodeURIComponent(
            article.thumbnail as string
          )}`
        );
        const json = await res.json();
        if (res.ok && json?.signedUrl)
          return { id: article.id, url: json.signedUrl };
      } catch (err) {
        // ignore
      }
      return { id: article.id, url: article.thumbnail as string };
    });

    const results = await Promise.all(fetches);
    const map: Record<string, string> = {};
    for (const r of results) map[r.id] = r.url;
    setThumbnailMap((prev) => ({ ...prev, ...map }));
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case "kesehatan-reproduksi":
        return <Heart className="h-4 w-4" />;
      case "tips-pms":
        return <Brain className="h-4 w-4" />;
      case "nutrisi":
        return <Apple className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (categoryColor: string) => {
    return {
      backgroundColor: categoryColor + "20",
      color: categoryColor,
    };
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return <PageLoading text="Memuat artikel edukasi..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={loadArticles}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - match admin hero style but retain user theme */}
        <div className="relative overflow-hidden bg-linear-to-r from-pink-600 via-pink-500 to-rose-500 rounded-3xl mb-8 p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                  🎓 Edukasi Kesehatan
                </h2>
                <p className="text-pink-100 text-lg opacity-90 max-w-2xl">
                  Dapatkan informasi terpercaya dari tenaga kesehatan
                  profesional tentang kesehatan menstruasi, tips PMS, dan
                  nutrisi untuk keseimbangan hormon.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  className="bg-white text-pink-700 hover:bg-pink-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-6 text-base font-semibold"
                  asChild
                >
                  <a href="/">💬 Konsultasi Dokter</a>
                </Button>
              </div>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Cari artikel, topik, atau tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-pink-400 text-base"
                />
              </div>
            </div>

            <div className="w-full md:w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-pink-300">
                  <Filter className="h-5 w-5 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-0 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">
                    Total Artikel
                  </p>
                  <p className="text-4xl font-bold text-slate-800">
                    {articles.length}
                  </p>
                </div>
                <div className="p-4 bg-linear-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">
                    Artikel Dipublikasikan
                  </p>
                  <p className="text-4xl font-bold text-slate-800">
                    {articles.filter((a) => a.published).length}
                  </p>
                </div>
                <div className="p-4 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">
                    Penulis
                  </p>
                  <p className="text-4xl font-bold text-slate-800">
                    {
                      Array.from(new Set(articles.map((a) => a.author.name)))
                        .length
                    }
                  </p>
                </div>
                <div className="p-4 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-700 text-base font-medium">
            📚 Menampilkan{" "}
            <span className="font-bold text-pink-600">
              {filteredArticles.length}
            </span>{" "}
            dari <span className="font-bold">{articles.length}</span> artikel
            {selectedCategory !== "all" &&
              ` dalam kategori "${
                categories.find((c) => c.slug === selectedCategory)?.name ||
                selectedCategory
              }"`}
            {searchTerm && ` untuk "${searchTerm}"`}
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <Card className="border-0 shadow-xl bg-linear-to-br from-pink-50 to-purple-50 max-w-md mx-auto">
              <CardContent className="p-12">
                <div className="mb-6">
                  <div className="h-20 w-20 rounded-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto shadow-lg">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {articles.length === 0
                    ? "Belum Ada Artikel"
                    : "Tidak Ada Hasil"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {articles.length === 0
                    ? "Artikel edukasi akan segera ditambahkan. Silakan cek kembali nanti!"
                    : searchTerm
                    ? `Tidak ada artikel yang cocok dengan pencarian "${searchTerm}"`
                    : `Tidak ada artikel dalam kategori ${
                        categories.find((c) => c.slug === selectedCategory)
                          ?.name || selectedCategory
                      }`}
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md"
                  >
                    🔄 Reset Filter
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredArticles.map((article) => {
              const imageSrc =
                (thumbnailMap[article.id] || article.thumbnail) ?? undefined;

              return (
                <Card
                  key={article.id}
                  onClick={() => router.push(`/education/${article.id}`)}
                  role="button"
                  tabIndex={0}
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border-0 shadow-lg bg-white"
                >
                  <div className="w-full h-48 sm:h-56 md:h-48 lg:h-44 xl:h-56 bg-slate-100 overflow-hidden relative">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`thumbnail-${article.title}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-pink-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        style={getCategoryColor(article.category.color)}
                        className="text-xs font-semibold shadow-lg"
                      >
                        {getCategoryIcon(article.category.slug)}
                        <span className="ml-1">{article.category.name}</span>
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pt-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <h3 className="text-lg font-bold line-clamp-2 text-gray-800 hover:text-pink-600 transition-colors">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-pink-500" />
                        <span className="font-medium">
                          {article.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span>{article.readTime} menit</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 py-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/education/${article.id}`);
                      }}
                    >
                      📖 Baca Selengkapnya
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
