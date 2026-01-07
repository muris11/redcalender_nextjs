"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Heart,
  Shield,
  Smartphone,
  TrendingUp,
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
    return null;
  }

  return (
    <>
      {/* Hero Section - Modern Split Layout */}
      <section className="relative min-h-[90vh] flex items-center bg-linear-to-br from-pink-50 via-white to-pink-50/30 overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 w-full h-full opacity-[0.03] bg-[radial-gradient(#ec4899_1px,transparent_1px)] bg-size-[16px_16px]" />
        
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8 animate-slide-up-fade">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-pink-100 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
                <span className="text-sm font-medium text-pink-700">Platform Kesehatan Wanita #1 Indonesia</span>
              </div>
              
              <Heading size="display-xl" className="tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                Kenali Tubuhmu, <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">Cintai Dirimu.</span>
              </Heading>
              
              <Text variant="body-xl" className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Asisten pribadi pintar untuk memantau siklus menstruasi, masa subur, dan kesehatan reproduksi dengan akurasi medis tinggi.
              </Text>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/register">
                  <Button size="xl" className="w-full sm:w-auto rounded-full px-8 bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white shadow-lg shadow-pink-200/50 hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1">
                    Mulai Sekarang - Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-2 border-gray-200 hover:border-pink-200 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 lg:pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-12">
                <div>
                  <div className="flex -space-x-3 justify-center lg:justify-start mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">+10k</div>
                  </div>
                  <Text variant="label-sm" className="text-gray-500">Bergabung dengan 10.000+ Wanita</Text>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-1 text-yellow-400 mb-1 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <Text variant="label-sm" className="text-gray-500">4.8/5 Rating Rata-rata</Text>
                </div>
              </div>
            </div>

            {/* Hero Visual - Responsive & Modern */}
            <div className="relative hidden lg:block h-[600px] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
               {/* Abstract background shapes */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-linear-to-tr from-pink-200/40 via-purple-200/40 to-blue-200/40 rounded-full blur-3xl opacity-60 animate-pulse-ring pointer-events-none" />
               
               {/* Glassmorphism Card Stack */}
               <div className="relative h-full w-full flex items-center justify-center scale-90 xl:scale-100">
                 {/* Background Card */}
                 <div className="absolute w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform -rotate-6 -translate-x-12 translate-y-8 opacity-60 scale-95 blur-[1px]">
                    <div className="absolute inset-0 bg-white">
                      <div className="h-full w-full bg-pink-50/50 p-6"></div>
                    </div>
                 </div>
                 
                 {/* Main Phone Frame */}
                 <div className="relative z-10 w-[340px] h-[680px] bg-gray-900 rounded-[3.5rem] ring-8 ring-gray-900 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 border-[6px] border-gray-800">
                    {/* Screen Content Mockup */}
                    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden">
                      {/* Status Bar */}
                      <div className="h-7 bg-pink-600 w-full flex justify-between items-center px-6 pt-1">
                        <div className="text-[10px] text-white font-medium">9:41</div>
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                          <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                        </div>
                      </div>

                      {/* Header Area */}
                      <div className="bg-pink-600 pb-8 pt-4 px-6 flex flex-col justify-end relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="text-white relative z-10">
                          <div className="text-sm font-medium opacity-90 mb-1">Halo, Girls! 👋</div>
                          <div className="text-2xl font-bold tracking-tight">Hari ke-5</div>
                          <div className="text-lg opacity-90">Fase Menstruasi</div>
                        </div>
                      </div>

                      {/* Main Scrollable Content */}
                      <div className="flex-1 p-5 space-y-4 bg-gray-50 overflow-hidden relative">
                        {/* Period Prediction Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 relative overflow-hidden group">
                           <div className="absolute right-0 top-0 w-16 h-16 bg-pink-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                          <div className="flex justify-between items-center mb-3 relative z-10">
                            <span className="text-sm font-semibold text-gray-700">Prediksi</span>
                            <div className="bg-pink-100 p-1.5 rounded-lg">
                              <Calendar className="h-4 w-4 text-pink-500" />
                            </div>
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1">Masa Subur</div>
                          <div className="text-sm text-gray-500">12 - 16 Januari 2026</div>
                          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                             <div className="bg-pink-500 h-2 rounded-full w-[60%]"></div>
                          </div>
                        </div>

                        {/* Health Insight Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700">Kesehatan Hari Ini</span>
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          </div>
                          <div className="flex gap-2 mb-3">
                             <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">Kram Ringan</span>
                             <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">Mood Swing</span>
                          </div>
                          <div className="text-sm text-gray-500 leading-snug">
                            Minum air hangat dan istirahat cukup dapat membantu meredakan kram.
                          </div>
                        </div>
                        
                        {/* Daily Tips (Partial) */}
                        <div className="bg-linear-to-r from-purple-500 to-indigo-500 p-5 rounded-2xl shadow-md text-white">
                           <div className="font-bold text-sm mb-1">Tips Harian</div>
                           <div className="text-xs opacity-90">Konsumsi makanan kaya zat besi hari ini.</div>
                        </div>
                      </div>

                      {/* Bottom Nav */}
                      <div className="h-[72px] bg-white border-t border-gray-100 flex items-center justify-around px-6 pb-2">
                         <div className="flex flex-col items-center gap-1">
                           <div className="h-10 w-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shadow-sm"><Calendar size={20} /></div>
                         </div>
                         <div className="flex flex-col items-center gap-1 opacity-40">
                            <TrendingUp size={20} className="text-gray-600" />
                         </div>
                         <div className="flex flex-col items-center gap-1 opacity-40">
                            <BookOpen size={20} className="text-gray-600" />
                         </div>
                      </div>
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-20"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Responsive Grid */}
      <section id="features" className="py-24 px-4 bg-white dark:bg-gray-950 relative">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Text variant="label-lg" className="text-pink-600 dark:text-pink-400 mb-4 uppercase tracking-wider font-semibold">
              Fitur Unggulan
            </Text>
            <Heading size="heading-lg" className="mb-6 text-gray-900 dark:text-white">
              Teknologi Canggih untuk Kesehatanmu
            </Heading>
            <Text variant="body-lg" className="text-gray-500 dark:text-gray-400">
              Kami menggabungkan sains medis terkini dengan desain intuitif untuk memberikan pengalaman pemantauan kesehatan terbaik.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                title: "Pencatatan Cerdas",
                desc: "Algoritma AI yang belajar dari pola unik siklusmu untuk prediksi yang semakin akurat.",
                icon: Calendar,
                color: "bg-pink-100 text-pink-600",
              },
              {
                title: "Analisis Medis",
                desc: "Deteksi dini anomali siklus dan insight kesehatan yang dipersonalisasi oleh dokter.",
                icon: Heart,
                color: "bg-red-100 text-red-600",
              },
              {
                title: "Grafik & Laporan",
                desc: "Visualisasi data kesehatan yang indah dan mudah dipahami untuk memantau tren.",
                icon: TrendingUp,
                color: "bg-purple-100 text-purple-600",
              },
              {
                title: "Edukasi Terverifikasi",
                desc: "Akses perpustakaan artikel kesehatan yang ditulis dan diverifikasi oleh ahli medis.",
                icon: BookOpen,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Privasi Prioritas",
                desc: "Enkripsi tingkat militer menjaga data sensitifmu tetap aman dan pribadi.",
                icon: Shield,
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Personalisasi Tema",
                desc: "Ekspresikan dirimu dengan berbagai tema aplikasi yang lucu dan menarik.",
                icon: CheckCircle2,
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                title: "Notifikasi Pintar",
                desc: "Pengingat otomatis untuk periode menstruasi, masa subur, dan waktu minum vitamin.",
                icon: Bell,
                color: "bg-orange-100 text-orange-600",
              },
              {
                title: "Akses Multi-Device",
                desc: "Sinkronisasi data otomatis di semua perangkatmu, kapan saja dan dimana saja.",
                icon: Smartphone,
                color: "bg-indigo-100 text-indigo-600",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-gray-100 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700/50 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 dark:hover:shadow-pink-900/20 transition-all duration-300 group bg-white dark:bg-gray-900 h-full">
                <CardHeader>
                  <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <Heading size="heading-sm" className="text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{feature.title}</Heading>
                </CardHeader>
                <CardContent>
                  <Text variant="body-md" className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Alternating Layout */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-pink-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>
                <Card className="relative border-white/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardContent className="p-8 sm:p-12">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                        <div>
                          <Heading size="heading-md" className="text-gray-900 dark:text-white">Status Siklus</Heading>
                          <Text className="text-pink-600 font-medium mt-1">
                            Fase Folikuler • Hari ke-5
                          </Text>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shadow-inner">
                          <Calendar className="h-7 w-7 text-pink-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-pink-600 mb-1">28</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Hari Siklus</div>
                         </div>
                         <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">5</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Hari Menstruasi</div>
                         </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Progress Siklus</span>
                          <span>18%</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-pink-500 to-purple-500 w-[18%] rounded-full shadow-lg"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <Heading size="heading-lg" className="text-gray-900 dark:text-white leading-tight">
                Kenapa Ribuan Wanita Memilih <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">Red Calender?</span>
              </Heading>
              <div className="space-y-6">
                {[
                  { title: "Akurasi Tinggi", desc: "Prediksi hingga 98% akurat setelah 3 bulan penggunaan rutin." },
                  { title: "Aman & Privat", desc: "Data kesehatanmu adalah milikmu. Backup otomatis & aman." },
                  { title: "Komunitas Supportif", desc: "Bergabung dengan komunitas wanita yang saling mendukung." },
                  { title: "Gratis Selamanya", desc: "Nikmati fitur inti tanpa biaya berlangganan selamanya." },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <Text variant="body-lg" className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</Text>
                      <Text variant="body-md" className="text-gray-500 dark:text-gray-400">{item.desc}</Text>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Link href="/register">
                  <Button size="lg" className="bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                    Gabung Komunitas Kami
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
