"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import {
    ArrowRight,
    BookOpen,
    Calendar,
    CheckCircle2,
    Heart,
    Shield,
    Star,
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-50 via-purple-50 to-white -z-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-200 rounded-full blur-[100px] opacity-30 -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full blur-[100px] opacity-30 -z-10 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-md border border-pink-100 text-pink-600 font-bold rounded-full text-sm shadow-sm hover:shadow-md transition-all cursor-default">
              <Star className="h-4 w-4 fill-pink-600" />
              Platform Kesehatan Wanita #1 di Indonesia
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Temukan Keseimbangan <br />
            <span className="bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-300% animate-gradient">
              Siklus & Kesehatanmu
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Red Calender membantu Anda memahami tubuh, memprediksi masa subur, 
            dan menjaga kesehatan reproduksi dengan teknologi AI yang personal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-12 py-8 shadow-xl hover:shadow-pink-200/50 transition-all duration-300 border-0 rounded-2xl font-bold group"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-8 border-2 border-pink-200 hover:border-pink-300 bg-white/50 hover:bg-white text-pink-600 font-bold rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                Pelajari Fitur
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200/50 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
            <p className="text-sm text-gray-500 mb-6 font-medium">DIPERCAYA OLEH RIBUAN WANITA INDONESIA</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholder logos - in a real app these would be images */}
               {["Kemenkes", "Halodoc", "Alodokter", "KlikDokter"].map((brand) => (
                 <span key={brand} className="text-xl font-bold text-gray-400 hover:text-pink-500 transition-colors cursor-default">{brand}</span>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-4 block">Fitur Unggulan</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lebih Dari Sekadar <br />
              <span className="bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Kalender Menstruasi
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menggabungkan sains medis dengan desain yang intuitif untuk pengalaman terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Pencatatan Akurat",
                desc: "Algoritma pintar yang belajar dari siklus unik Anda untuk prediksi yang semakin presisi.",
                icon: Calendar,
                color: "from-pink-400 to-pink-600",
                bg: "bg-pink-50",
              },
              {
                title: "Analisis Kesehatan",
                desc: "Deteksi dini anomali siklus dan dapatkan insight kesehatan yang dipersonalisasi.",
                icon: Heart,
                color: "from-red-400 to-red-600",
                bg: "bg-red-50",
              },
              {
                title: "Grafik & Laporan",
                desc: "Visualisasi data kesehatan yang mudah dipahami untuk memantau perkembangan tubuh.",
                icon: TrendingUp,
                color: "from-purple-400 to-purple-600",
                bg: "bg-purple-50",
              },
              {
                title: "Edukasi Terpercaya",
                desc: "Akses ratusan artikel kesehatan yang diverifikasi oleh dokter spesialis.",
                icon: BookOpen,
                color: "from-blue-400 to-blue-600",
                bg: "bg-blue-50",
              },
              {
                title: "Privasi Terjamin",
                desc: "Data Anda dienkripsi end-to-end. Kami tidak pernah menjual data kesehatan Anda.",
                icon: Shield,
                color: "from-green-400 to-green-600",
                bg: "bg-green-50",
              },
              {
                title: "Personalisasi Tema",
                desc: "Sesuaikan tampilan aplikasi dengan mood Anda. Tersedia tema Kucing, Gajah, dan Unicorn.",
                icon: Users,
                color: "from-orange-400 to-orange-600",
                bg: "bg-orange-50",
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-white rounded-3xl"
              >
                <div className={`h-2 bg-linear-to-r ${feature.color}`}></div>
                <CardHeader className="pt-8">
                  <div className={`h-16 w-16 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 bg-linear-to-b from-pink-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-[2rem] opacity-20 blur-2xl"></div>
                <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl border border-pink-100">
                   {/* Mockup UI Representation */}
                   <div className="space-y-6">
                     <div className="flex items-center justify-between mb-8">
                       <div>
                         <h3 className="text-2xl font-bold text-gray-900">Status Hari Ini</h3>
                         <p className="text-pink-500 font-medium">Fase Folikuler • Hari ke-5</p>
                       </div>
                       <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                         <Calendar className="h-6 w-6 text-pink-600" />
                       </div>
                     </div>
                     <div className="h-40 bg-linear-to-r from-pink-50 to-purple-50 rounded-xl flex items-center justify-center border border-pink-100">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-gray-900 mb-2">28 Hari</p>
                          <p className="text-gray-500">Rata-rata Siklus</p>
                        </div>
                     </div>
                     <div className="space-y-3">
                       {[1, 2, 3].map((i) => (
                         <div key={i} className="h-12 bg-gray-50 rounded-lg w-full animate-pulse"></div>
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Kenapa Memilih <br />
                <span className="text-pink-600">Red Calender?</span>
              </h2>
              <div className="space-y-6">
                {[
                  "Akurasi prediksi hingga 98% setelah 3 bulan penggunaan",
                  "Backup data otomatis ke cloud yang aman",
                  "Konsultasi kesehatan gratis setiap bulan",
                  "Komunitas wanita yang suportif",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-xl text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8">
                <Link href="/register">
                  <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-7 rounded-xl text-lg font-bold shadow-xl">
                    Bergabung Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] bg-white opacity-10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Siap Mengambil Kontrol atas <br /> Kesehatan Anda?
          </h2>
          <p className="text-xl md:text-2xl text-pink-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Bergabunglah dengan komunitas wanita cerdas yang peduli dengan kesehatan reproduksi mereka. Gratis selamanya untuk fitur dasar.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold rounded-2xl border-0"
              >
                Buat Akun Gratis
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-pink-200 text-sm font-medium">
            Tidak perlu kartu kredit • Batalkan kapan saja
          </p>
        </div>
      </section>
    </>
  );
}
