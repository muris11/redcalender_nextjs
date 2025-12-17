"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import {
    Calendar,
    CheckCircle,
    Loader2,
    LogOut,
    Save,
    Settings,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, logout } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    avgCycleLength: "28",
    avgPeriodLength: "6",
    theme: "kucing",
    currentlyMenstruating: "",
    menstrualStatus: "",
  });

  useEffect(() => {
    // Set page title
    // document.title = "Profil Saya - Red Calendar"; // Handled by metadata

    // wait for auth to initialize
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        avgCycleLength: user.avgCycleLength?.toString() || "28",
        avgPeriodLength: user.avgPeriodLength?.toString() || "6",
        theme: user.theme || "kucing",
        currentlyMenstruating: (user as any).currentlyMenstruating || "",
        menstrualStatus: user.menstrualStatus || "",
      });
    }
  }, [isAuthenticated, user, router, isLoading]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success("Profil berhasil diperbarui");
      } else {
        toast.error(data.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) return null;

  // If user data is not yet loaded but auth is done, show skeleton
  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <ProfileSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            👤 Profil Saya
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            Kelola informasi pribadi dan pengaturan akun Anda
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden glass-card">
            <div className="h-1 sm:h-2 bg-linear-to-r from-green-400 to-green-600"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 sm:h-7 sm:w-7 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">
                    Status Akun
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    ✓ Aktif
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden glass-card">
            <div className="h-1 sm:h-2 bg-linear-to-r from-blue-400 to-blue-600"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">
                    Onboarding
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {user?.isOnboarded ? "✓ Selesai" : "⏳ Belum"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden glass-card">
            <div className="h-1 sm:h-2 bg-linear-to-r from-purple-400 to-purple-600"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Settings className="h-5 w-5 sm:h-7 sm:w-7 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-gray-600 mb-1">
                    Siklus Rata-rata
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {user?.avgCycleLength || 28} hari
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Confirmation */}
        {user?.isOnboarded && (
          <Card className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden glass-card">
            <div className="h-2 bg-linear-to-r from-green-400 via-green-500 to-emerald-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                      Data Onboarding Lengkap
                    </h3>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Terima kasih telah melengkapi profil Anda!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/onboarding")}
                  size="sm"
                  className="border-0 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Onboarding
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="menstrualStatus"
                    className="text-base font-semibold"
                  >
                    Status Menstruasi
                  </Label>
                  <Input
                    id="menstrualStatus"
                    value={user.menstrualStatus || "Belum diisi"}
                    disabled
                    className="h-12 border-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="onboarding-avgPeriodLength"
                    className="text-base font-semibold"
                  >
                    Durasi Periode (hari)
                  </Label>
                  <Input
                    id="onboarding-avgPeriodLength"
                    value={`${user.avgPeriodLength || 6} hari`}
                    disabled
                    className="h-12 border-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="onboarding-avgCycleLength"
                    className="text-base font-semibold"
                  >
                    Panjang Siklus (hari)
                  </Label>
                  <Input
                    id="onboarding-avgCycleLength"
                    value={`${user.avgCycleLength || 28} hari`}
                    disabled
                    className="h-12 border-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden glass-card">
            <div className="h-2 bg-linear-to-r from-pink-400 to-pink-600"></div>
            <CardHeader className="bg-pink-50/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-pink-700">
                    Informasi Pribadi
                  </CardTitle>
                  <CardDescription className="text-pink-600/80">
                    Update informasi dasar akun Anda
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-2 focus:border-pink-500 transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="h-12 bg-gray-50 border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 border-2 focus:border-pink-500 transition-all"
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-base font-semibold">
                  Tanggal Lahir
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  className="h-12 border-2 focus:border-pink-500 transition-all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cycle Settings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden glass-card">
            <div className="h-2 bg-linear-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="bg-purple-50/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-purple-700">
                    Pengaturan Siklus
                  </CardTitle>
                  <CardDescription className="text-purple-600/80">
                    Sesuaikan perhitungan siklus menstruasi Anda
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="avgCycleLength"
                  className="text-base font-semibold"
                >
                  Rata-rata Panjang Siklus (hari)
                </Label>
                <Select
                  value={formData.avgCycleLength}
                  onValueChange={(value) =>
                    handleInputChange("avgCycleLength", value)
                  }
                >
                  <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 35 }, (_, i) => i + 21).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} hari
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgPeriodLength">
                  Rata-rata Durasi Haid (hari)
                </Label>
                <Select
                  value={formData.avgPeriodLength}
                  onValueChange={(value) =>
                    handleInputChange("avgPeriodLength", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} hari
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Menstruation Status */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden glass-card">
            <div className="h-2 bg-linear-to-r from-rose-400 to-rose-600"></div>
            <CardHeader className="bg-rose-50/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🩸</span>
                </div>
                <div>
                  <CardTitle className="text-xl text-rose-700">
                    Status Menstruasi
                  </CardTitle>
                  <CardDescription className="text-rose-600/80">
                    Update status menstruasi Anda saat ini
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="currentlyMenstruating"
                  className="text-base font-semibold"
                >
                  Apakah Sedang Menstruasi?
                </Label>
                <Select
                  value={formData.currentlyMenstruating}
                  onValueChange={(value) =>
                    handleInputChange("currentlyMenstruating", value)
                  }
                >
                  <SelectTrigger className="h-12 border-2 focus:border-rose-500">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">🩸 Ya, sedang menstruasi</SelectItem>
                    <SelectItem value="no">✨ Tidak sedang menstruasi</SelectItem>
                    <SelectItem value="unsure">🤔 Tidak yakin</SelectItem>
                    <SelectItem value="prefer_not">🔒 Tidak ingin menjawab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="menstrualStatus"
                  className="text-base font-semibold"
                >
                  Keteraturan Siklus (3 bulan terakhir)
                </Label>
                <Select
                  value={formData.menstrualStatus}
                  onValueChange={(value) =>
                    handleInputChange("menstrualStatus", value)
                  }
                >
                  <SelectTrigger className="h-12 border-2 focus:border-rose-500">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">✅ Teratur (siklus 21-35 hari)</SelectItem>
                    <SelectItem value="irregular">📊 Tidak teratur</SelectItem>
                    <SelectItem value="never">🌸 Belum pernah menstruasi</SelectItem>
                    <SelectItem value="prefer_not">🔒 Tidak ingin menjawab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden glass-card">
            <div className="h-2 bg-linear-to-r from-teal-400 to-teal-600"></div>
            <CardHeader className="bg-teal-50/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-md">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-teal-700">
                    Tampilan Aplikasi
                  </CardTitle>
                  <CardDescription className="text-teal-600/80">
                    Personalisasi pengalaman Anda
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-base font-semibold">
                  Tema Favorit
                </Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => handleInputChange("theme", value)}
                >
                  <SelectTrigger className="h-12 border-2 focus:border-teal-500">
                    <SelectValue placeholder="Pilih Tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kucing">🐱 Kucing</SelectItem>
                    <SelectItem value="gajah">🐘 Gajah</SelectItem>
                    <SelectItem value="unicorn">🦄 Unicorn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              className="border-0 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-8 py-6"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span className="text-base font-semibold">Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  <span className="text-base font-semibold">
                    Simpan Perubahan
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-12">
          <Card className="border-2 border-red-100 shadow-lg overflow-hidden glass-card">
            <CardHeader className="bg-red-50/50">
              <CardTitle className="text-red-700 flex items-center">
                <LogOut className="h-5 w-5 mr-2" />
                Area Berbahaya
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-gray-700 font-medium">Keluar dari Aplikasi</p>
                <p className="text-sm text-gray-500">
                  Anda harus login kembali untuk mengakses akun Anda.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
