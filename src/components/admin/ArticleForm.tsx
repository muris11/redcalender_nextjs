"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ArticleFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    categoryId: string;
    thumbnail?: string;
    published: boolean;
  };
  isEditing?: boolean;
}

export function ArticleForm({
  initialData,
  isEditing = false,
}: ArticleFormProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || "",
    thumbnail: initialData?.thumbnail || "",
    published: initialData?.published || false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.thumbnail || null
  );
  // track a local object URL for the input; only revoke if we created it
  const [localObjectUrl, setLocalObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Lightweight client-side compression for images before upload
  const compressImage = async (file: File, maxWidth = 1280) => {
    if (!file.type.startsWith("image/")) return file;
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      let { width, height } = img;
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = Math.round(maxWidth);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0, width, height);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve as any, "image/jpeg", 0.8)
      );
      URL.revokeObjectURL(objectUrl);
      if (!blob) return file;
      // Create a File so that Supabase receives a proper filename + type
      const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
      return newFile;
    } catch (err) {
      return file;
    }
  };

  // If editing and we have a storage path for the thumbnail, request a signed URL for preview
  useEffect(() => {
    const thumb = initialData?.thumbnail;
    if (thumb && !/^https?:\/\//i.test(thumb)) {
      (async () => {
        try {
          const res = await fetch(
            `/api/admin/upload/signed?path=${encodeURIComponent(thumb)}`
          );
          const json = await res.json();
          if (res.ok && json?.signedUrl) {
            setPreviewUrl(json.signedUrl);
          }
        } catch (err) {
          // ignore errors silently; preview will remain empty
        }
      })();
    }
  }, [initialData?.thumbnail]);
  // Handled above — duplicate useEffect removed.

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!authLoading && user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, authLoading, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.categoryId
    ) {
      toast.error("Title, content, and category are required");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to create an article");
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/articles/${initialData?.id}`
        : "/api/admin/articles";

      const method = isEditing ? "PUT" : "POST";

      const requestBody = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId,
        thumbnail: formData.thumbnail?.trim() || null,
        published: formData.published,
        ...(isEditing ? {} : { createdBy: user.id }),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(
          `Article ${isEditing ? "updated" : "created"} successfully`
        );
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(responseData.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save article");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-white/20 hover:text-slate-800 rounded-xl transition-all duration-200"
          >
            <Link href="/admin/articles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? "Edit Artikel" : "Artikel Baru"}
          </h2>
        </div>
        <div className="flex items-center space-x-4 bg-white/40 backdrop-blur-sm p-2 rounded-xl border border-white/40">
          <div className="flex items-center space-x-2 px-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, published: checked }))
              }
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label htmlFor="published" className="font-medium text-slate-700">Dipublikasikan</Label>
          </div>
          <Button
            type="submit"
            disabled={isLoading || uploading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            {isLoading || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? "Mengupload..." : "Menyimpan..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Artikel
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">
        <div className="grid gap-2">
          <Label htmlFor="title" className="font-bold text-slate-700">Judul</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            placeholder="Judul artikel"
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-white/50 backdrop-blur-sm h-12 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="categoryId" className="font-bold text-slate-700">Kategori</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              required
            >
              <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-white/50 backdrop-blur-sm h-12">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="thumbnail" className="font-bold text-slate-700">Thumbnail Gambar</Label>

            <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-4 sm:space-y-0 w-full">
              <label
                htmlFor="thumbnail"
                className="relative w-full sm:w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-200 group"
                aria-describedby="thumbnail-help"
              >
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-sm text-slate-500 group-hover:text-emerald-600">
                  <span className="font-medium">Klik atau seret gambar</span>
                  <span className="text-xs opacity-70 mt-1">Maks 5MB (JPG/PNG)</span>
                </div>
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload thumbnail image"
                  onChange={async (e) => {
                    const selected = e.target.files?.[0];
                    if (!selected) return;

                    // validate type and size
                    if (!selected.type.startsWith("image/")) {
                      toast.error("Hanya file gambar yang diizinkan");
                      return;
                    }

                    const maxSize = 5 * 1024 * 1024; // 5MB
                    if (selected.size > maxSize) {
                      toast.error("Ukuran file maksimal 5MB");
                      return;
                    }

                    // preview (earliest possible)
                    const objectUrl = URL.createObjectURL(selected);
                    setLocalObjectUrl(objectUrl);
                    setPreviewUrl(objectUrl);

                    // compress/resize image on client for faster uploads when applicable
                    const compressedFile = await compressImage(selected);
                    if (compressedFile && compressedFile !== selected) {
                      const compressedUrl = URL.createObjectURL(compressedFile);
                      setLocalObjectUrl(compressedUrl);
                      setPreviewUrl(compressedUrl);
                    }

                    try {
                      setUploading(true);
                      setUploadProgress(10);

                      const fileForUpload = compressedFile || selected;
                      const form = new FormData();
                      form.append(
                        "file",
                        fileForUpload as any,
                        (fileForUpload as any).name || selected.name
                      );

                      const res = await fetch("/api/admin/upload", {
                        method: "POST",
                        body: form,
                      });

                      const json = await res.json();
                      if (!res.ok) {
                        console.error("Upload endpoint error", json);
                        toast.error(json.error || "Gagal mengupload gambar");
                        setUploading(false);
                        return;
                      }

                      const url = json.publicUrl || json.signedUrl;
                      if (url) {
                        setFormData((prev) => ({
                          ...prev,
                          // store the object path for the DB if present (private buckets), otherwise store the public URL
                          thumbnail: json.path || url,
                        }));
                        setPreviewUrl(url);
                        // revoke the local object URL if it was created
                        if (localObjectUrl) {
                          try {
                            URL.revokeObjectURL(localObjectUrl);
                          } catch (err) {
                            // noop
                          }
                        }
                        setLocalObjectUrl(null);
                        toast.success("Gambar berhasil diupload");
                      } else {
                        toast.error(
                          "Upload berhasil tapi tidak mendapatkan URL publik"
                        );
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error("Gagal mengupload gambar");
                    } finally {
                      setUploading(false);
                      setUploadProgress(100);
                      // if we created an object URL earlier and upload didn't replace it,
                      // make sure to revoke to avoid memory leaks
                      setTimeout(() => {
                        if (localObjectUrl) {
                          try {
                            URL.revokeObjectURL(localObjectUrl);
                          } catch (err) {
                            // noop
                          }
                        }
                      }, 2000);
                    }
                  }}
                />
              </label>
              
              {previewUrl && (
                <div className="relative w-full sm:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={async () => {
                        // Confirm deletion
                        const deleteFromStorage = confirm(
                          "Hapus gambar ini?"
                        );

                        // just clear preview and reference
                        if (!deleteFromStorage) return;

                        // delete from storage
                        try {
                          setUploading(true);
                          // extract a storage path if the thumbnail is a full public URL
                          const extractPath = (value: string) => {
                            try {
                              if (!value) return "";
                              if (/^https?:\/\//i.test(value)) {
                                const u = new URL(value);
                                const parts = u.pathname.split("/");
                                const idx = parts.indexOf("articles");
                                if (idx >= 0) return parts.slice(idx + 1).join("/");
                                return value;
                              }
                              return value;
                            } catch (err) {
                              return value;
                            }
                          };

                          const path = formData.thumbnail
                            ? extractPath(formData.thumbnail)
                            : localObjectUrl || "";
                          if (!path) {
                            // nothing to delete
                            setLocalObjectUrl(null);
                            setPreviewUrl(null);
                            setFormData((prev) => ({ ...prev, thumbnail: "" }));
                            return;
                          }

                          const res = await fetch("/api/admin/upload", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ path }),
                          });
                          const json = await res.json();
                          if (!res.ok) {
                            toast.error(
                              json.error || "Gagal menghapus file dari storage"
                            );
                            return;
                          }

                          // success
                          if (localObjectUrl) {
                            try {
                              URL.revokeObjectURL(localObjectUrl);
                            } catch (err) {}
                          }
                          setLocalObjectUrl(null);
                          setPreviewUrl(null);
                          setFormData((prev) => ({ ...prev, thumbnail: "" }));
                          toast.success("Gambar berhasil dihapus");
                        } catch (err) {
                          console.error(err);
                          toast.error("Gagal menghapus file");
                        } finally {
                          setUploading(false);
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {uploading && (
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="h-2 bg-emerald-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content" className="font-bold text-slate-700">Konten</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            required
            placeholder="Tulis konten artikel di sini..."
            className="min-h-[400px] font-mono border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-white/50 backdrop-blur-sm p-4 leading-relaxed"
          />
          <p className="text-xs text-slate-500 font-medium">
            Mendukung format Markdown dasar.
          </p>
        </div>
      </div>
    </form>
  );
}
