"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Loader2, Plus, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    articles: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Error fetching categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Ini akan mempengaruhi semua artikel dalam kategori ini."
      )
    )
      return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Kategori berhasil dihapus");
        fetchCategories();
      } else {
        toast.error("Gagal menghapus kategori");
      }
    } catch (error) {
      toast.error("Error deleting category");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <p className="text-slate-600 font-medium">Memuat kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-0 mb-8 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Manajemen Kategori 🏷️
              </h1>
              <p className="text-orange-100 text-lg opacity-90">
                Organisir artikel dengan kategori yang terstruktur
              </p>
            </div>
            <Button
              asChild
              className="bg-white text-orange-700 hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/admin/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Kategori Baru
              </Link>
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Total Kategori
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {categories.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Aktif
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {categories.filter((c) => c.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Tidak Aktif
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {categories.filter((c) => !c.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl shadow-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Total Artikel
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {categories.reduce(
                    (sum, c) => sum + (c._count?.articles || 0),
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <h3 className="text-xl font-bold text-slate-800">
              Daftar Kategori
            </h3>
            <p className="text-slate-600 mt-1">
              Kelola semua kategori artikel dalam sistem
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-700">
                    Nama
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Slug
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Deskripsi
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Warna
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Artikel
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Urutan
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="text-center">
                        <Tag className="h-12 w-12 mx-auto mb-4 opacity-50 text-slate-400" />
                        <p className="text-lg font-medium mb-2">
                          Belum ada kategori
                        </p>
                        <p className="text-sm">
                          Buat kategori pertama untuk mengorganisir artikel
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category, index) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200 border-b border-slate-100/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium text-slate-800">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-mono">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={category.description}>
                          {category.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-mono text-slate-600">
                            {category.color}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                        >
                          {category._count?.articles || 0} artikel
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                          className={`font-medium ${
                            category.isActive
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {category.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                          #{category.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                          >
                            <Link href={`/admin/categories/${category.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                            onClick={() => handleDelete(category.id)}
                            disabled={isDeleting === category.id}
                          >
                            {isDeleting === category.id ? (
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
    </div>
  );
}
