"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/loading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CheckCircle,
    Edit,
    File,
    FileText,
    Loader2,
    Plus,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  thumbnail?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  author: { name: string };
  published: boolean;
  createdAt: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const articlesPerPage = 10;

  const fetchArticles = async (page = 1) => {
    try {
      const response = await fetch(
        `/api/admin/articles?page=${page}&limit=${articlesPerPage}`,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setTotalArticles(data.totalArticles);
        setCurrentPage(page);
        // if some articles use a storage path instead of a public URL, request signed URLs
        fetchSignedUrls(data.articles || []);
      } else {
        toast.error("Gagal mengambil artikel");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil artikel");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // fetch signed urls for any article.thumbnail that is a storage path, not an http URL
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
            article.thumbnail || ""
          )}`
        );
        const json = await res.json();
        if (res.ok && json?.signedUrl) {
          return { id: article.id, url: json.signedUrl };
        }
      } catch (err) {
        // ignore
      }
      return { id: article.id, url: article.thumbnail || "" };
    });

    const results = await Promise.all(fetches);
    const map: Record<string, string> = {};
    for (const r of results) map[r.id] = r.url;
    setThumbnailMap((prev) => ({ ...prev, ...map }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Artikel berhasil dihapus");
        fetchArticles();
      } else {
        toast.error("Gagal menghapus artikel");
      }
    } catch (error) {
      toast.error("Error menghapus artikel");
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchArticles(page);
  };

  if (isLoading) {
    return <PageLoading text="Memuat artikel..." />;
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
                Manajemen Artikel 📝
              </h1>
              <p className="text-emerald-100 text-lg font-medium opacity-90 max-w-2xl">
                Buat dan kelola konten edukasi untuk pengguna Anda
              </p>
            </div>
            <Button
              asChild
              className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-6 py-6 font-bold"
            >
              <Link href="/admin/articles/new">
                <Plus className="h-5 w-5 mr-2" />
                Artikel Baru
              </Link>
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl p-6 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Total Artikel
                </p>
                <p className="text-3xl font-extrabold text-slate-800 group-hover:scale-105 transition-transform">
                  {totalArticles}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl p-6 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Dipublikasikan
                </p>
                <p className="text-3xl font-extrabold text-slate-800 group-hover:scale-105 transition-transform">
                  {articles.filter((a) => a.published).length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl p-6 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Draf
                </p>
                <p className="text-3xl font-extrabold text-slate-800 group-hover:scale-105 transition-transform">
                  {articles.filter((a) => !a.published).length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <File className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-100/50 bg-white/30">
            <h3 className="text-xl font-bold text-slate-800">Daftar Artikel</h3>
            <p className="text-slate-600 mt-1">
              Kelola semua artikel dalam sistem
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100/50">
                  <TableHead className="hidden sm:table-cell font-bold text-slate-700">
                    Gambar
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Judul
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-700">
                    Kategori
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-700">
                    Penulis
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-700">
                    Dibuat Pada
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="text-center">
                        <div className="bg-slate-100 p-4 rounded-full inline-block mb-3">
                          <FileText className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium mb-2">
                          Belum ada artikel
                        </p>
                        <p className="text-sm">
                          Buat artikel pertama Anda untuk memulai
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article, index) => (
                    <TableRow
                      key={article.id}
                      className="hover:bg-white/60 transition-all duration-200 border-b border-slate-100/50 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="hidden sm:table-cell">
                        {thumbnailMap[article.id] || article.thumbnail ? (
                          <img
                            src={thumbnailMap[article.id] || article.thumbnail}
                            alt={`thumbnail-${article.title}`}
                            className="w-14 h-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-14 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-semibold text-slate-800 max-w-xs">
                        <div className="truncate" title={article.title}>
                          {article.title}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className="capitalize font-bold shadow-sm px-3 py-1 rounded-lg"
                          style={{
                            backgroundColor: article.category?.color
                              ? article.category.color + "20"
                              : "#f1f5f9",
                            color: article.category?.color || "#64748b",
                            border: `1px solid ${
                              article.category?.color || "#e2e8f0"
                            }40`,
                          }}
                        >
                          {article.category?.name || "Tidak Ada Kategori"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-700 font-medium">
                        {article.author.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={article.published ? "default" : "outline"}
                          className={`font-bold px-3 py-1 rounded-lg ${
                            article.published
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                              : "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                          }`}
                        >
                          {article.published ? "Dipublikasikan" : "Draf"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-600 font-medium">
                        {new Date(article.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                          >
                            <Link href={`/admin/articles/${article.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            onClick={() => handleDelete(article.id)}
                            disabled={isDeleting === article.id}
                          >
                            {isDeleting === article.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm font-medium text-slate-600">
                Menampilkan{" "}
                <strong className="text-slate-900">
                  {articles.length === 0
                    ? 0
                    : (currentPage - 1) * articlesPerPage + 1}{" "}
                </strong>
                hingga{" "}
                <strong className="text-slate-900">
                  {currentPage === totalPages
                    ? totalArticles
                    : currentPage * articlesPerPage}
                </strong>{" "}
                dari <strong className="text-slate-900">{totalArticles}</strong>{" "}
                artikel
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105 border-slate-200 rounded-xl"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105 border-slate-200 rounded-xl"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
