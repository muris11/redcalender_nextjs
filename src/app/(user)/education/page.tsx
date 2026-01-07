"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { ArticleCardSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
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
    // Set page title
    // document.title = "Edukasi Kesehatan - Red Calendar"; // Handled by metadata

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

      const response = await fetch("/api/articles");

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
          `/api/upload/signed?path=${encodeURIComponent(
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
      const response = await fetch("/api/categories");
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

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Header Skeleton */}
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-3xl mb-10"></div>
        
        {/* Search Skeleton */}
        <div className="h-20 w-full bg-gray-200 animate-pulse rounded-2xl mb-10"></div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
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
            className="text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
      {/* Header Section */}
      <div className="bg-primary rounded-lg mb-6 sm:mb-8 lg:mb-10 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <Heading level="1" variant="display-lg" className="text-white">
            Edukasi Kesehatan
          </Heading>
        </div>
        <Text variant="body-lg" className="text-white/90 max-w-2xl mb-4">
          Dapatkan informasi terpercaya dari tenaga kesehatan profesional tentang kesehatan menstruasi, tips PMS, nutrisi untuk keseimbangan hormon, dan panduan kesehatan reproduksi.
        </Text>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-white text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            Terpercaya
          </Badge>
          <Badge className="bg-white text-primary">
            <Heart className="h-3 w-3 mr-1" />
            Ahli Kesehatan
          </Badge>
          <Badge className="bg-white text-primary">
            <BookOpen className="h-3 w-3 mr-1" />
            Update Terbaru
          </Badge>
        </div>
      </div>

        {/* Search and Filter Section */}
        <Card className="mb-6 sm:mb-8 lg:mb-10">
          <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Cari materi edukasi, topik kesehatan, atau kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-gray-200 focus:ring-theme text-sm sm:text-base rounded-lg sm:rounded-xl"
                />
              </div>
            </div>

            <div className="w-full lg:w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 sm:h-12 border-2 border-gray-200 hover:border-primary rounded-lg">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm sm:text-base">
                    Semua Kategori
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
            <Text variant="body-sm" className="text-gray-600 mr-2 self-center">
              Filter Cepat:
            </Text>
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
                className="transition-colors"
              >
                {getCategoryIcon(category.slug)}
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>
          </CardContent>
        </Card>

        {/* Stats Cards - Mobile App Style */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <Text variant="display-sm" className="font-bold text-gray-900 mb-1">
                    {articles.length}
                  </Text>
                  <Text variant="body-sm" className="text-gray-600 font-medium">
                    Total Materi
                  </Text>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                  </div>
                  <Text variant="display-sm" className="font-bold text-gray-900 mb-1">
                    {articles.filter((a) => a.published).length}
                  </Text>
                  <Text variant="body-sm" className="text-gray-600 font-medium">
                    Terpublikasi
                  </Text>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                    <User className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
                  </div>
                  <Text variant="display-sm" className="font-bold text-gray-900 mb-1">
                    {
                      Array.from(new Set(articles.map((a) => a.author.name)))
                        .length
                    }
                  </Text>
                  <Text variant="body-sm" className="text-gray-600 font-medium">
                    Penulis Ahli
                  </Text>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                  </div>
                  <Text variant="display-sm" className="font-bold text-gray-900 mb-1">
                    {categories.length}
                  </Text>
                  <Text variant="body-sm" className="text-gray-600 font-medium">
                    Kategori
                  </Text>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <Text variant="body-base" className="font-medium">
              Menampilkan{" "}
              <span className="font-bold text-primary">
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
            </Text>
            {(searchTerm || selectedCategory !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                size="sm"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Education Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <Card className="max-w-lg mx-auto">
              <CardContent className="p-8 sm:p-12">
                <div className="mb-6">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                </div>
                <Heading level="3" variant="heading-lg" className="mb-3">
                  {articles.length === 0
                    ? "Materi Edukasi Akan Segera Ditambahkan"
                    : "Tidak Ada Hasil Ditemukan"}
                </Heading>
                <Text variant="body-base" className="text-gray-600 mb-6 leading-relaxed">
                  {articles.length === 0
                    ? "Materi edukasi kesehatan akan segera ditambahkan oleh tenaga ahli. Silakan cek kembali nanti untuk update terbaru!"
                    : searchTerm
                    ? `Tidak ada materi edukasi yang cocok dengan pencarian "${searchTerm}"`
                    : `Tidak ada materi dalam kategori ${
                        categories.find((c) => c.slug === selectedCategory)
                          ?.name || selectedCategory
                      }`}
                </Text>
                {(searchTerm || selectedCategory !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Reset dan Lihat Semua
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
            {filteredArticles.map((article) => {
              const imageSrc =
                (thumbnailMap[article.id] || article.thumbnail) ?? undefined;

              return (
                <Card
                  key={article.id}
                  onClick={() => router.push(`/education/${article.id}`)}
                  role="button"
                  tabIndex={0}
                  className="hover:border-primary transition-colors cursor-pointer overflow-hidden group bg-white"
                >
                  {/* Image with better aspect ratio */}
                  <div className="w-full aspect-[4/3] sm:aspect-video bg-gray-100 overflow-hidden relative">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`Thumbnail materi: ${article.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
                      </div>
                    )}
                    {/* Preloading Overlay */}
                    {preloadingArticle === article.id && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                        <Loading size="sm" text="Memuat artikel..." />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3 sm:p-4">
                    {/* Category Badge - Inside Card */}
                    <div className="mb-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs font-medium bg-primary/10 text-primary border-0 hover:bg-primary/20"
                      >
                        {getCategoryIcon(article.category.slug)}
                        <span className="ml-1">{article.category.name}</span>
                      </Badge>
                    </div>

                    {/* Title */}
                    <Heading level="3" variant="heading-sm" className="line-clamp-2 text-sm sm:text-base mb-2 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </Heading>

                    {/* Excerpt - Hidden on mobile for cleaner look */}
                    <Text variant="body-sm" className="hidden sm:block text-gray-600 mb-3 line-clamp-2 leading-relaxed text-xs">
                      {article.excerpt}
                    </Text>

                    {/* Meta Information - Compact */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center space-x-1 min-w-0 flex-1">
                        <User className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-medium truncate">
                          {article.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>{article.readTime} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Button with white text */}
                    <Button
                      className="w-full text-white text-xs sm:text-sm h-8 sm:h-9 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(article.id);
                      }}
                      disabled={preloadingArticle === article.id}
                    >
                      {preloadingArticle === article.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                          <span className="text-white">Memuat...</span>
                        </div>
                      ) : (
                        <span className="text-white">Baca Selengkapnya</span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
    </main>
  );
}
