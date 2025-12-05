"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import {
  BookOpen,
  Calendar,
  Heart,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestHome() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-linear-to-br from-pink-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-6 py-3 bg-linear-to-r from-pink-100 to-purple-100 text-pink-700 font-bold rounded-full text-sm shadow-lg mb-6">
              Platform Kesehatan Wanita Terpercaya
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Temukan Keseimbangan{" "}
            <span className="bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Siklus Anda
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Red Calendar adalah aplikasi pencatatan dan analisis siklus
            menstruasi yang membantu Anda memahami tubuh, memprediksi masa
            subur, dan menjaga kesehatan reproduksi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-xl font-bold"
              >
                Mulai Gratis Sekarang
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 border-pink-300 hover:border-pink-400 hover:bg-pink-50 text-pink-600 font-bold rounded-xl transition-all duration-300"
              >
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-3 bg-linear-to-r from-pink-100 to-purple-100 text-pink-700 font-bold rounded-full text-sm shadow-md mb-4">
              Fitur Lengkap
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fitur Unggulan{" "}
              <span className="bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Red Calendar
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dirancang dengan sains dan kepedulian untuk kesehatan wanita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-pink-400 to-pink-600"></div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-pink-400 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">
                  Pencatatan Siklus Akurat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Catat durasi menstruasi, gejala, dan perubahan tubuh dengan
                  mudah. Dapatkan prediksi yang semakin akurat seiring waktu.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-red-400 to-red-600"></div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Analisis Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Deteksi dini ketidakteraturan siklus dan dapatkan peringatan
                  kesehatan berbasis bukti ilmiah.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-purple-400 to-purple-600"></div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">
                  Grafik Tren Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Visualisasi data siklus Anda dalam grafik yang mudah dipahami.
                  Unduh laporan untuk konsultasi dokter.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-blue-400 to-blue-600"></div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Edukasi Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Artikel edukatif tentang kesehatan reproduksi yang ditulis
                  oleh tenaga kesehatan profesional.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-green-400 to-green-600"></div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Privasi Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Data kesehatan Anda dienkripsi dan dilindungi. Hanya Anda yang
                  memiliki akses ke informasi pribadi.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="h-2 bg-linear-to-r from-orange-400 to-orange-600"></div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">
                  Personalisasi Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Pilih tema favorit Anda (Kucing, Gajah, atau Unicorn) untuk
                  pengalaman yang lebih personal dan menyenangkan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-pink-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mulai Perjalanan Kesehatan Anda Hari Ini
          </h2>
          <p className="text-xl md:text-2xl text-pink-100 mb-10 leading-relaxed">
            Bergabung dengan ribuan wanita yang telah mempercayai kesehatan
            reproduksinya pada Red Calendar
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-pink-600 hover:bg-pink-50 text-lg px-10 py-7 shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold rounded-xl border-0"
            >
              Daftar Sekarang - Gratis
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
