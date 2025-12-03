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
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isOnboarded: boolean;
  createdAt: string;
  _count: {
    cycles: number;
  };
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const fetchUsers = async (page = 1) => {
    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&limit=${usersPerPage}`,
        { cache: "no-store" }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalUsers(data.totalUsers);
        setCurrentPage(page);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
      )
    )
      return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Pengguna berhasil dihapus");
        fetchUsers(); // Refresh list
      } else {
        toast.error("Gagal menghapus pengguna");
      }
    } catch (error) {
      toast.error("Error deleting user");
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page); // Fetch users for the new page
  };

  if (isLoading) {
    return <PageLoading text="Memuat pengguna..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-0 mb-8 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Manajemen Pengguna 👥
              </h1>
              <p className="text-blue-100 text-lg opacity-90">
                Kelola pengguna terdaftar dan peran mereka dalam sistem
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Total: {totalUsers}
                  </span>
                </div>
              </div>
            </div>
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
                  Total Pengguna
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {totalUsers}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Sudah Onboard
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {users.filter((u) => u.isOnboarded).length}
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {users.filter((u) => !u.isOnboarded).length}
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Admin
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Daftar Pengguna
                </h3>
                <p className="text-slate-600 mt-1">
                  Kelola semua pengguna dalam sistem
                </p>
              </div>
              <Button
                onClick={() => router.push("/admin/users/new")}
                className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengguna
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-700">
                    Nama
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Peran
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Siklus
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Bergabung
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="text-center">
                        <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50 text-slate-400" />
                        <p className="text-lg font-medium mb-2">
                          Belum ada pengguna
                        </p>
                        <p className="text-sm">
                          Pengguna akan muncul di sini setelah mendaftar
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-linear-to-r hover:from-slate-50 hover:to-white transition-all duration-200 border-b border-slate-100/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium text-slate-800">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ADMIN" ? "default" : "secondary"
                          }
                          className={`font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isOnboarded ? "outline" : "destructive"}
                          className={`font-medium ${
                            user.isOnboarded
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-orange-100 text-orange-700 border-orange-200"
                          }`}
                        >
                          {user.isOnboarded ? "Sudah Onboard" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {user._count.cycles}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                            onClick={() =>
                              router.push(`/admin/users/${user.id}/edit`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                            onClick={() => handleDelete(user.id)}
                            disabled={
                              isDeleting === user.id || user.role === "ADMIN"
                            }
                          >
                            {isDeleting === user.id ? (
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
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                Menampilkan{" "}
                <strong className="text-slate-800">
                  {(currentPage - 1) * usersPerPage + 1}{" "}
                </strong>
                hingga{" "}
                <strong className="text-slate-800">
                  {Math.min(currentPage * usersPerPage, totalUsers)}
                </strong>{" "}
                dari <strong className="text-slate-800">{totalUsers}</strong>{" "}
                pengguna
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="hover:bg-slate-50 transition-all duration-200 hover:scale-105"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="hover:bg-slate-50 transition-all duration-200 hover:scale-105"
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
