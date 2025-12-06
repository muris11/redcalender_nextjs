"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loading, PageLoading } from "@/components/ui/loading";
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
  GraduationCap,
  Heart,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EducationArticle {
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

  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string; color: string }>
  >([]);
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string>>({});
  const [filteredArticles, setFilteredArticles] = useState<EducationArticle[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preloadingArticle, setPreloadingArticle] = useState<string | null>(
    null
  );

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
      const transformedArticles: EducationArticle[] = data.articles.map(
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

  const fetchSignedUrls = async (list: EducationArticle[]) => {
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

  const handleReadMore = async (articleId: string) => {
    setPreloadingArticle(articleId);

    try {
      // Navigate immediately for better performance
      router.push(`/education/${articleId}`);
    } catch (error) {
      console.error("Error navigating to article:", error);
      setPreloadingArticle(null);
    }
  };
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return <PageLoading text="Memuat materi edukasi kesehatan..." />;
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Header Section - Enhanced Education Hero */}
        <div className="relative overflow-hidden bg-linear-to-r from-pink-600 via-pink-500 to-rose-500 rounded-xl sm:rounded-2xl lg:rounded-3xl mb-6 sm:mb-8 lg:mb-10 p-6 sm:p-8 lg:p-10 xl:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-3 sm:mb-4">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 mr-3 text-pink-200" />
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                    Edukasi Kesehatan
                  </h1>
                </div>
                <p className="text-pink-100 text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl leading-relaxed">
                  Dapatkan informasi terpercaya dari tenaga kesehatan
                  profesional tentang kesehatan menstruasi, tips PMS, nutrisi
                  untuk keseimbangan hormon, dan panduan kesehatan reproduksi.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Terpercaya
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-3 py-1">
                    <Heart className="h-3 w-3 mr-1" />
                    Ahli Kesehatan
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-3 py-1">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Update Terbaru
                  </Badge>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="h-4 w-4 text-yellow-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Enhanced Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full blur-xl"></div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border-0 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Cari materi edukasi, topik kesehatan, atau kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-gray-200 focus:border-pink-400 text-sm sm:text-base rounded-lg sm:rounded-xl"
                />
              </div>
            </div>

            <div className="w-full lg:w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 sm:h-12 border-2 border-gray-200 hover:border-pink-300 rounded-lg sm:rounded-xl">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm sm:text-base">
                    📚 Semua Kategori
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.slug}
                      className="text-sm sm:text-base"
                    >
                      {getCategoryIcon(category.slug)}
                      <span className="ml-2">{category.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm text-gray-600 mr-2 self-center">
              Filter Cepat:
            </span>
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.slug ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.slug ? "all" : category.slug
                  )
                }
                className={`text-xs sm:text-sm px-3 py-1 h-7 sm:h-8 rounded-full transition-all duration-200 ${
                  selectedCategory === category.slug
                    ? "bg-pink-500 hover:bg-pink-600 text-white shadow-md"
                    : "border-pink-200 text-pink-600 hover:bg-pink-50"
                }`}
              >
                {getCategoryIcon(category.slug)}
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="px-0 mb-6 sm:mb-8 lg:mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mb-1 sm:mb-2">
                    Total Materi
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                    {articles.length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 bg-linear-to-br from-pink-500 to-rose-500 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg ml-3 sm:ml-4">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mb-1 sm:mb-2">
                    Materi Terpublikasi
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                    {articles.filter((a) => a.published).length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg ml-3 sm:ml-4">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mb-1 sm:mb-2">
                    Penulis Ahli
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                    {
                      Array.from(new Set(articles.map((a) => a.author.name)))
                        .length
                    }
                  </p>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 bg-linear-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg ml-3 sm:ml-4">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mb-1 sm:mb-2">
                    Kategori
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                    {categories.length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 bg-linear-to-br from-green-500 to-teal-500 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg ml-3 sm:ml-4">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Summary */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              Menampilkan{" "}
              <span className="font-bold text-pink-600">
                {filteredArticles.length}
              </span>{" "}
              dari <span className="font-bold">{articles.length}</span> materi
              edukasi
              {selectedCategory !== "all" &&
                ` dalam kategori "${
                  categories.find((c) => c.slug === selectedCategory)?.name ||
                  selectedCategory
                }"`}
              {searchTerm && ` untuk "${searchTerm}"`}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                size="sm"
                className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 text-xs sm:text-sm px-3 py-2 h-auto"
              >
                🔄 Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Education Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <Card className="border-0 shadow-xl bg-linear-to-br from-pink-50 to-purple-50 max-w-lg mx-auto">
              <CardContent className="p-8 sm:p-12">
                <div className="mb-6">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto shadow-lg">
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  {articles.length === 0
                    ? "Materi Edukasi Akan Segera Ditambahkan"
                    : "Tidak Ada Hasil Ditemukan"}
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                  {articles.length === 0
                    ? "Materi edukasi kesehatan akan segera ditambahkan oleh tenaga ahli. Silakan cek kembali nanti untuk update terbaru!"
                    : searchTerm
                    ? `Tidak ada materi edukasi yang cocok dengan pencarian "${searchTerm}"`
                    : `Tidak ada materi dalam kategori ${
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
                    🔄 Reset dan Lihat Semua
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {filteredArticles.map((article) => {
              const imageSrc =
                (thumbnailMap[article.id] || article.thumbnail) ?? undefined;

              return (
                <Card
                  key={article.id}
                  onClick={() => router.push(`/education/${article.id}`)}
                  role="button"
                  tabIndex={0}
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border-0 shadow-lg bg-white group"
                >
                  <div className="w-full h-40 sm:h-48 lg:h-44 xl:h-52 bg-slate-100 overflow-hidden relative">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`Thumbnail materi: ${article.title}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 group-hover:brightness-110"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-pink-300" />
                      </div>
                    )}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <Badge
                        style={getCategoryColor(article.category.color)}
                        className="text-xs font-semibold shadow-lg backdrop-blur-sm"
                      >
                        {getCategoryIcon(article.category.slug)}
                        <span className="ml-1">{article.category.name}</span>
                      </Badge>
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    {/* Preloading Overlay */}
                    {preloadingArticle === article.id && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loading size="sm" text="Memuat artikel..." />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pt-3 sm:pt-4 pb-2 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <h3 className="text-base sm:text-lg font-bold line-clamp-2 text-gray-800 hover:text-pink-600 transition-colors group-hover:text-pink-600">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-3 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 shrink-0" />
                        <span className="font-medium truncate">
                          {article.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-2 sm:ml-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                          <span className="hidden sm:inline">
                            {new Date(article.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                          <span className="sm:hidden">
                            {new Date(article.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                          <span>{article.readTime} min</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 py-2 sm:py-3 text-sm sm:text-base font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(article.id);
                      }}
                      disabled={preloadingArticle === article.id}
                    >
                      {preloadingArticle === article.id ? (
                        <div className="flex items-center justify-center">
                          <div className="relative mr-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-4 border-pink-200 border-t-pink-600" />
                            <div className="absolute inset-0 animate-pulse rounded-full bg-pink-100 opacity-50 h-4 w-4" />
                          </div>
                          Memuat...
                        </div>
                      ) : (
                        <>Baca Selengkapnya</>
                      )}
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
