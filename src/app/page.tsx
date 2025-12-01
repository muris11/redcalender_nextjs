'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, BookOpen, Shield, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌸</span>
              <h1 className="text-xl font-bold text-pink-600">Red Calendar</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-pink-600 hover:bg-pink-700">Daftar</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Temukan Keseimbangan <span className="text-pink-600">Siklus Anda</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Red Calendar adalah aplikasi pencatatan dan analisis siklus menstruasi yang 
            membantu Anda memahami tubuh, memprediksi masa subur, dan menjaga kesehatan reproduksi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-3">
                Mulai Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Red Calendar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dirancang dengan sains dan kepedulian untuk kesehatan wanita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <CardTitle>Pencatatan Siklus Akurat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Catat durasi menstruasi, gejala, dan perubahan tubuh dengan mudah. 
                  Dapatkan prediksi yang semakin akurat seiring waktu.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Analisis Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Deteksi dini ketidakteraturan siklus dan dapatkan peringatan kesehatan 
                  berbasis bukti ilmiah.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Grafik Tren Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Visualisasi data siklus Anda dalam grafik yang mudah dipahami. 
                  Export laporan PDF untuk konsultasi dokter.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Edukasi Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Artikel edukatif tentang kesehatan reproduksi yang ditulis 
                  oleh tenaga kesehatan profesional.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Privasi Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Data kesehatan Anda dienkripsi dan dilindungi. Hanya Anda yang 
                  memiliki akses ke informasi pribadi.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Personalisasi Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pilih tema favorit Anda (Kucing, Gajah, atau Unicorn) untuk 
                  pengalaman yang lebih personal dan menyenangkan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mulai Perjalanan Kesehatan Anda Hari Ini
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Bergabung dengan ribuan wanita yang telah mempercayai kesehatan reproduksinya pada Red Calendar
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Daftar Sekarang - Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌸</span>
                <h3 className="text-xl font-bold">Red Calendar</h3>
              </div>
              <p className="text-gray-400">
                Aplikasi pencatatan dan analisis siklus menstruasi terpercaya
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fitur</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Pencatatan Siklus</li>
                <li>Analisis Kesehatan</li>
                <li>Edukasi</li>
                <li>Export Laporan</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Panduan Penggunaan</li>
                <li>FAQ</li>
                <li>Kontak Support</li>
                <li>Kebijakan Privasi</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Red Calendar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}