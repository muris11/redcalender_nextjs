"use client";

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
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
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
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

export default function ProfileContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, logout } = useAuthStore();
  const { setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
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

  // Function to fetch latest user data from database
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setIsLoadingProfile(true);
      const response = await fetch(`/api/user/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          // Update the auth store with fresh data from DB
          setUser(data.user);
          return data.user;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  }, [setUser]);

  useEffect(() => {
    // wait for auth to initialize
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.id) {
      // Fetch fresh data from database on page load
      fetchUserProfile(user.id).then((freshUser) => {
        const userData = freshUser || user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          birthDate: userData.birthDate
            ? new Date(userData.birthDate).toISOString().split("T")[0]
            : "",
          avgCycleLength: userData.avgCycleLength?.toString() || "28",
          avgPeriodLength: userData.avgPeriodLength?.toString() || "6",
          theme: userData.theme || "kucing",
          currentlyMenstruating: userData.currentlyMenstruating || "",
          menstrualStatus: userData.menstrualStatus || "",
        });
      });
    }
  }, [isAuthenticated, user?.id, router, isLoading, fetchUserProfile]);

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
        // Merge current formData with returned user data to preserve form state
        const updatedUser = {
          ...user,
          ...data.user,
          // Preserve the formData values for fields that might be empty in response
          avgCycleLength: data.user.avgCycleLength ?? parseInt(formData.avgCycleLength),
          avgPeriodLength: data.user.avgPeriodLength ?? parseInt(formData.avgPeriodLength),
          theme: data.user.theme || formData.theme,
          currentlyMenstruating: data.user.currentlyMenstruating || formData.currentlyMenstruating,
          menstrualStatus: data.user.menstrualStatus || formData.menstrualStatus,
        };
        setUser(updatedUser);
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
    router.push("/");
  };

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) return null;

  // If user data is not yet loaded but auth is done, show skeleton
  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <ProfileSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <Heading level="1" size="heading-xl" className="mb-2">
          Profil Saya
        </Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Kelola informasi pribadi dan pengaturan akun Anda
        </Text>
      </div>

      {/* Status Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <Card className="text-center">
          <CardContent className="pt-5 pb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <Text variant="display-sm" className="font-bold text-green-600 mb-1">
              Aktif
            </Text>
            <Text variant="body-xs" className="text-muted-foreground">
              Status Akun
            </Text>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-5 pb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <Text variant="display-sm" className="font-bold text-blue-600 mb-1">
              {user?.isOnboarded ? "Selesai" : "Belum"}
            </Text>
            <Text variant="body-xs" className="text-muted-foreground">
              Onboarding
            </Text>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-5 pb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <Text variant="display-sm" className="font-bold text-purple-600 mb-1">
              {user?.avgCycleLength || 28}
            </Text>
            <Text variant="body-xs" className="text-muted-foreground">
              Siklus (hari)
            </Text>
          </CardContent>
        </Card>
      </div>

        {/* Data Confirmation */}
        {user?.isOnboarded && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Data Onboarding Lengkap</span>
                </CardTitle>
                <Button
                  onClick={() => router.push("/onboarding")}
                  size="sm"
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Onboarding
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status Menstruasi
                  </Label>
                  <Input
                    value={user.menstrualStatus || "Belum diisi"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Durasi Periode (hari)
                  </Label>
                  <Input
                    value={`${user.avgPeriodLength || 6} hari`}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Panjang Siklus (hari)
                  </Label>
                  <Input
                    value={`${user.avgCycleLength || 28} hari`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span>Informasi Pribadi</span>
              </CardTitle>
              <CardDescription>
                Update informasi dasar akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  Tanggal Lahir
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Cycle Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Pengaturan Siklus</span>
              </CardTitle>
              <CardDescription>
                Sesuaikan perhitungan siklus menstruasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="avgCycleLength">
                  Rata-rata Panjang Siklus (hari)
                </Label>
                <Select
                  value={formData.avgCycleLength}
                  onValueChange={(value) =>
                    handleInputChange("avgCycleLength", value)
                  }
                >
                  <SelectTrigger>
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Status Menstruasi</span>
              </CardTitle>
              <CardDescription>
                Update status menstruasi Anda saat ini
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentlyMenstruating">
                  Apakah Sedang Menstruasi?
                </Label>
                <Select
                  value={formData.currentlyMenstruating}
                  onValueChange={(value) =>
                    handleInputChange("currentlyMenstruating", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Ya, sedang menstruasi</SelectItem>
                    <SelectItem value="no">Tidak sedang menstruasi</SelectItem>
                    <SelectItem value="unsure">Tidak yakin</SelectItem>
                    <SelectItem value="prefer_not">Tidak ingin menjawab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="menstrualStatus">
                  Keteraturan Siklus (3 bulan terakhir)
                </Label>
                <Select
                  value={formData.menstrualStatus}
                  onValueChange={(value) =>
                    handleInputChange("menstrualStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Teratur (siklus 21-35 hari)</SelectItem>
                    <SelectItem value="irregular">Tidak teratur</SelectItem>
                    <SelectItem value="never">Belum pernah menstruasi</SelectItem>
                    <SelectItem value="prefer_not">Tidak ingin menjawab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Tampilan Aplikasi</span>
              </CardTitle>
              <CardDescription>
                Personalisasi pengalaman Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="theme">Tema Favorit</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => {
                    handleInputChange("theme", value);
                    setTheme(value as "kucing" | "gajah" | "unicorn");
                    const themeNames = {
                      kucing: "Kucing (Pink & Rose)",
                      gajah: "Gajah (Purple & Lavender)",
                      unicorn: "Unicorn (Teal & Cyan)"
                    };
                    toast.success("Tema Berhasil Diubah!", {
                      description: `Tema ${themeNames[value as keyof typeof themeNames]} telah diterapkan. Jangan lupa klik "Simpan Perubahan" di bawah!`,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kucing">
                      <div className="flex items-center gap-2">
                        <span>🐱</span>
                        <span>Kucing</span>
                        <span className="text-xs text-muted-foreground">(Pink & Rose)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gajah">
                      <div className="flex items-center gap-2">
                        <span>🐘</span>
                        <span>Gajah</span>
                        <span className="text-xs text-muted-foreground">(Purple & Lavender)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="unicorn">
                      <div className="flex items-center gap-2">
                        <span>🦄</span>
                        <span>Unicorn</span>
                        <span className="text-xs text-muted-foreground">(Teal & Cyan)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-3 p-3 rounded-lg bg-muted border">
                  <p className="text-sm text-muted-foreground">
                    Tema akan langsung diterapkan ke seluruh aplikasi. Klik <strong>"Simpan Perubahan"</strong> untuk menyimpan pilihan Anda secara permanen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan Perubahan
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
  );
}
