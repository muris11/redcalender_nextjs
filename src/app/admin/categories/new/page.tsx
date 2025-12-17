"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ICON_OPTIONS = [
  { value: "Heart", label: "Heart" },
  { value: "Brain", label: "Brain" },
  { value: "Apple", label: "Apple" },
  { value: "BookOpen", label: "Book Open" },
  { value: "Calendar", label: "Calendar" },
  { value: "Star", label: "Star" },
];

const COLOR_OPTIONS = [
  { value: "#FF6B9D", label: "Pink" },
  { value: "#4ECDC4", label: "Teal" },
  { value: "#45B7D1", label: "Blue" },
  { value: "#96CEB4", label: "Green" },
  { value: "#FFEAA7", label: "Yellow" },
  { value: "#DDA0DD", label: "Plum" },
];

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Heart",
    color: "#FF6B9D",
    order: 1,
    isActive: true,
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name
    if (field === "name" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Kategori berhasil dibuat");
        router.push("/admin/categories");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal membuat kategori");
      }
    } catch (error) {
      toast.error("Error creating category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-0 mb-8 p-8 text-white shadow-2xl shadow-orange-500/20 border border-white/10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/20 rounded-xl"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  Kategori Baru 📝
                </h1>
              </div>
              <p className="text-orange-100 text-lg font-medium opacity-90 max-w-2xl ml-14">
                Tambahkan kategori artikel baru untuk mengorganisir konten
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">
          <Card className="max-w-4xl border-0 shadow-none bg-transparent">
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-base font-bold text-slate-700">Nama Kategori *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="contoh: Kesehatan Reproduksi"
                      required
                      className="h-12 text-lg border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="slug" className="text-base font-bold text-slate-700">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="contoh: kesehatan-reproduksi"
                      required
                      className="h-12 text-lg border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/50 backdrop-blur-sm"
                    />
                    <p className="text-xs text-slate-500 font-medium ml-1">
                      Dihasilkan otomatis dari nama, digunakan di URL
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="description" className="text-base font-bold text-slate-700">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Deskripsi singkat kategori ini..."
                    rows={4}
                    className="resize-none border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/50 backdrop-blur-sm p-4 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="icon" className="text-base font-bold text-slate-700">Ikon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) =>
                        handleInputChange("icon", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/50 backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="color" className="text-base font-bold text-slate-700">Warna</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        handleInputChange("color", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/50 backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="order" className="text-base font-bold text-slate-700">Urutan Tampilan</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) =>
                        handleInputChange(
                          "order",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-white/40 w-fit">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Label htmlFor="isActive" className="text-base font-medium text-slate-700 cursor-pointer">Kategori Aktif</Label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/categories")}
                    className="h-12 px-6 rounded-xl border-slate-300 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg shadow-orange-500/30 rounded-xl font-bold hover:scale-105 transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Save className="h-5 w-5 mr-2" />
                    )}
                    Buat Kategori
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
