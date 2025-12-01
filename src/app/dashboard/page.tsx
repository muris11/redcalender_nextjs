'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Droplets, Heart, MessageCircle, Plus, LogOut, TrendingUp, BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';

interface CycleData {
  nextPeriod?: Date;
  daysUntilNextPeriod?: number;
  currentPhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstrual';
  cycleDay?: number;
  isLate?: boolean;
  daysLate?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [cycleData, setCycleData] = useState<CycleData>({});
  const [waterIntake, setWaterIntake] = useState(1200); // ml
  const [waterGoal] = useState(2000); // ml

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user is onboarded
    if (!user?.isOnboarded) {
      router.push('/onboarding');
      return;
    }

    // Simulasi perhitungan siklus (nanti akan diambil dari API)
    const calculateCycleData = () => {
      const today = new Date();
      
      // Gunakan data dari user jika ada
      let lastPeriod = new Date(today);
      if (user?.lastPeriodDate) {
        lastPeriod = new Date(user.lastPeriodDate);
      } else {
        lastPeriod.setDate(today.getDate() - 15); // Simulasi haid terakhir 15 hari lalu
      }
      
      const avgCycleLength = user?.avgCycleLength || 28;
      const nextPeriod = new Date(lastPeriod);
      nextPeriod.setDate(lastPeriod.getDate() + avgCycleLength);
      
      const daysUntilNextPeriod = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let currentPhase: 'follicular' | 'ovulation' | 'luteal' | 'menstrual' = 'follicular';
      let cycleDay = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (cycleDay <= 7) currentPhase = 'menstrual';
      else if (cycleDay >= 12 && cycleDay <= 16) currentPhase = 'ovulation';
      else if (cycleDay > 16) currentPhase = 'luteal';

      setCycleData({
        nextPeriod,
        daysUntilNextPeriod: Math.max(0, daysUntilNextPeriod),
        currentPhase,
        cycleDay,
        isLate: daysUntilNextPeriod < 0,
        daysLate: Math.abs(daysUntilNextPeriod)
      });
    };

    calculateCycleData();
  }, [isAuthenticated, router, user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getPhaseMessage = () => {
    if (cycleData.isLate) {
      return {
        title: `Terlambat ${cycleData.daysLate} Hari`,
        subtitle: "Periode Anda terlambat",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: "⚠️"
      };
    }

    if (cycleData.currentPhase === 'menstrual') {
      return {
        title: `Haid Hari ke-${cycleData.cycleDay}`,
        subtitle: "Periode sedang berlangsung",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: "🩸"
      };
    }

    if (cycleData.currentPhase === 'ovulation') {
      return {
        title: `Masa Subur`,
        subtitle: `${cycleData.daysUntilNextPeriod} hari menuju ovulasi`,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: "🌸"
      };
    }

    return {
      title: `Haid ${cycleData.daysUntilNextPeriod} Hari Lagi`,
      subtitle: "Persiapkan diri Anda",
      color: "text-pink-600",
        bgColor: "bg-pink-50",
        icon: "📅"
      };
  };

  const phaseData = getPhaseMessage();
  const waterProgress = (waterIntake / waterGoal) * 100;

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-pink-600">🌸 Red Calendar</h1>
              <span className="text-gray-600">Hai, {user?.name}!</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Countdown Widget */}
        <Card className={`mb-8 ${phaseData.bgColor} border-0`}>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{phaseData.icon}</div>
            <h2 className={`text-3xl font-bold mb-2 ${phaseData.color}`}>
              {phaseData.title}
            </h2>
            <p className="text-gray-600 text-lg">{phaseData.subtitle}</p>
          </CardContent>
        </Card>

        {/* Tips Harian */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Tips Harian</h3>
                <p className="text-blue-700">
                  {cycleData.currentPhase === 'menstrual' 
                    ? "Minum air hangat dan konsumsi makanan kaya zat besi untuk mengganti darah yang hilang."
                    : cycleData.currentPhase === 'ovulation'
                    ? "Ini adalah waktu yang baik untuk berolahraga ringan dan menjaga kesehatan reproduksi."
                    : "Lanjutkan rutinitas sehat Anda dan perhatikan perubahan tubuh."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Water Tracker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                Tracker Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{waterIntake} ml</span>
                  <span>{waterGoal} ml</span>
                </div>
                <Progress value={waterProgress} className="h-2" />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setWaterIntake(prev => Math.min(prev + 250, waterGoal))}
                >
                  +250ml
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mini Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-green-500" />
                Kalender
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString('id-ID', { month: 'long' })}
                </div>
                <div className="text-sm text-gray-600">
                  Hari ke-{cycleData.cycleDay} dari siklus
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  asChild
                >
                  <Link href="/calendar">Lihat Kalender</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Plus className="h-5 w-5 mr-2 text-purple-500" />
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <Link href="/log">
                    <Clock className="h-4 w-4 mr-2" />
                    Catat Gejala
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <Link href="/analysis">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Lihat Analisis
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <Link href="/education">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Baca Artikel
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <Link href="/report">
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Laporan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fase Siklus Saat Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge variant="secondary" className="text-sm">
                  {cycleData.currentPhase === 'menstrual' && 'Fase Menstruasi'}
                  {cycleData.currentPhase === 'follicular' && 'Fase Folikuler'}
                  {cycleData.currentPhase === 'ovulation' && 'Fase Ovulasi'}
                  {cycleData.currentPhase === 'luteal' && 'Fase Luteal'}
                </Badge>
                <p className="text-sm text-gray-600">
                  {cycleData.currentPhase === 'menstrual' && 'Tubuh Anda sedang dalam fase menstruasi. Waktu yang baik untuk istirahat dan perawatan diri.'}
                  {cycleData.currentPhase === 'follicular' && 'Energi Anda mungkin mulai meningkat. Ini adalah waktu yang baik untuk memulai proyek baru.'}
                  {cycleData.currentPhase === 'ovulation' && 'Ini adalah masa subur Anda. Tingkat kesuburan tinggi.'}
                  {cycleData.currentPhase === 'luteal' && 'Hormon Anda sedang bersiap untuk menstruasi berikutnya. Fokus pada perawatan diri.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Siklus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rata-rata Siklus:</span>
                  <span className="font-medium">{user?.avgCycleLength} hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rata-rata Haid:</span>
                  <span className="font-medium">{user?.avgPeriodLength} hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hari Siklus:</span>
                  <span className="font-medium">Hari ke-{cycleData.cycleDay}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}