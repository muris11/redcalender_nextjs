"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/authStore";
import {
    Activity,
    Award,
    Calendar,
    Heart,
    Target,
    TrendingUp,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isMarkingPeriod, setIsMarkingPeriod] = useState(false);
  const [currentlyMenstruating, setCurrentlyMenstruating] = useState(false);

  useEffect(() => {
    // Set page title
    // document.title = "Dashboard - Red Calendar"; // Handled by metadata

    // Wait until auth state has initialized
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.id) {
      setIsDataLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/user/dashboard?userId=${user?.id}`);
        const data = await response.json();

        if (response.ok) {
          setDashboardData(data.dashboard);
        } else {
          console.error("Failed to fetch dashboard data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isLoading, router, user?.id]);

  // Update menstruating state when dashboard data loads
  useEffect(() => {
    if (dashboardData?.currentCycle?.currentPhase === 'menstrual') {
      setCurrentlyMenstruating(true);
    } else {
      setCurrentlyMenstruating(false);
    }
  }, [dashboardData]);

  // Helper function to get phase label in simple terms
  const getPhaseLabel = (phase?: string) => {
    switch (phase) {
      case "menstrual":
        return "Sedang Menstruasi";
      case "follicular":
        return "Setelah Menstruasi";
      case "ovulation":
        return "Masa Subur";
      case "luteal":
        return "Menjelang Menstruasi";
      default:
        return "Tidak Diketahui";
    }
  };

  // Handler untuk menandai mulai haid
  const handleMarkPeriodStart = async () => {
    if (!user?.id) return;
    setIsMarkingPeriod(true);
    try {
      const response = await fetch('/api/user/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          startDate: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setCurrentlyMenstruating(true);
        // Refresh dashboard data
        const dashResponse = await fetch(`/api/user/dashboard?userId=${user.id}`);
        const data = await dashResponse.json();
        if (dashResponse.ok) {
          setDashboardData(data.dashboard);
        }
      }
    } catch (error) {
      console.error('Error marking period start:', error);
    } finally {
      setIsMarkingPeriod(false);
    }
  };

  // Handler untuk menandai haid selesai
  const handleMarkPeriodEnd = async () => {
    if (!user?.id) return;
    setIsMarkingPeriod(true);
    try {
      const response = await fetch(`/api/user/cycles?userId=${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endDate: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setCurrentlyMenstruating(false);
        // Refresh dashboard data
        const dashResponse = await fetch(`/api/user/dashboard?userId=${user.id}`);
        const data = await dashResponse.json();
        if (dashResponse.ok) {
          setDashboardData(data.dashboard);
        }
      }
    } catch (error) {
      console.error('Error marking period end:', error);
    } finally {
      setIsMarkingPeriod(false);
    }
  };

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">Failed to load dashboard data</p>
          </div>
        </main>
      </div>
    );
  }

  // Map API response to component structure
  const userStats = {
    totalCycles: dashboardData.stats?.totalCycles || 0,
    averageCycleLength: dashboardData.recentCycles?.averageLength || 0,
    totalLogs: dashboardData.stats?.totalLogs || 0,
  };

  const healthMetrics = {
    currentPhase: dashboardData.currentCycle?.currentPhase || "unknown",
    averageSleep: dashboardData.healthMetrics?.averageSleep || 0,
    averageWater: dashboardData.healthMetrics?.averageWater || 0,
    moodScore: dashboardData.healthMetrics?.moodScore || 0,
  };

  const recentCycles = dashboardData.recentCycles
    ? [
        {
          currentDay: dashboardData.currentCycle?.cycleDay || 1,
          cycleLength: dashboardData.recentCycles?.averageLength || 28,
          startDate: dashboardData.recentCycles?.lastPeriodDate,
          endDate: null, // TODO: Calculate from API
          daysUntilNextPeriod:
            dashboardData.currentCycle?.daysUntilNextPeriod || 0,
        },
      ]
    : [];

  const upcomingEvents = dashboardData.alerts || [];
  const achievements = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Selamat datang kembali, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Pantau kesehatan reproduksi dan siklus menstruasi Anda di sini.
          </p>
        </div>

        {/* Period Tracking Card */}
        <Card className="mb-6 md:mb-8 border-0 shadow-lg overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg md:text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
                🩸 Pelacakan Haid
              </h3>
              <p className="text-sm md:text-base text-white/80 mt-1">
                {currentlyMenstruating 
                  ? "Anda sedang dalam periode haid" 
                  : "Tandai jika haid Anda dimulai hari ini"}
              </p>
            </div>
            {currentlyMenstruating ? (
              <Button 
                onClick={handleMarkPeriodEnd}
                disabled={isMarkingPeriod}
                className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {isMarkingPeriod ? "Menyimpan..." : "✓ Tandai Haid Selesai"}
              </Button>
            ) : (
              <Button 
                onClick={handleMarkPeriodStart}
                disabled={isMarkingPeriod}
                className="bg-white text-red-600 hover:bg-red-50 font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {isMarkingPeriod ? "Menyimpan..." : "🩸 Tandai Mulai Haid"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Total Siklus
              </CardTitle>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {userStats?.totalCycles || 0}
              </div>
              <p className="text-xs text-pink-100">Siklus tercatat</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Rata-rata Durasi
              </CardTitle>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {userStats?.averageCycleLength || 0}
              </div>
              <p className="text-xs text-purple-100">Hari per siklus</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Log Harian
              </CardTitle>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {userStats?.totalLogs || 0}
              </div>
              <p className="text-xs text-rose-100">Entri tercatat</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">
                Status Saat Ini
              </CardTitle>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-lg md:text-2xl font-bold text-white mb-1 capitalize">
                {healthMetrics?.currentPhase || "Tidak diketahui"}
              </div>
              <p className="text-xs text-indigo-100">Fase siklus</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Cycle Progress */}
        {recentCycles && recentCycles.length > 0 && (
          <Card className="mb-6 md:mb-8 border-0 shadow-lg overflow-hidden glass-card">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 md:p-6 text-white">
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Target className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Siklus Saat Ini
              </CardTitle>
            </div>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-base md:text-lg font-semibold text-gray-800">
                    Hari ke-{recentCycles[0].currentDay || 0} dari{" "}
                    {recentCycles[0].cycleLength || 28}
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-pink-600">
                    {Math.round(
                      ((recentCycles[0].currentDay || 0) /
                        (recentCycles[0].cycleLength || 28)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={
                      ((recentCycles[0].currentDay || 0) /
                        (recentCycles[0].cycleLength || 28)) *
                      100
                    }
                    className="h-3 md:h-4"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-600 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-xs md:text-sm">
                      Mulai:{" "}
                      {recentCycles[0].startDate
                        ? new Date(
                            recentCycles[0].startDate
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm">
                      {recentCycles[0].daysUntilNextPeriod || 0} hari lagi
                    </span>
                    <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Cycles & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Recent Cycles */}
          <Card className="border-0 shadow-lg glass-card">
            <CardHeader className="bg-gray-50/50 px-4 py-4 md:px-6 md:py-6 border-b border-gray-100">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 text-pink-600" />
                Siklus Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
              {recentCycles && recentCycles.length > 0 ? (
                <div className="space-y-3">
                  {recentCycles.slice(0, 3).map((cycle: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 hover:shadow-md transition-shadow duration-200 gap-2"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm md:text-base">
                          Siklus {cycle.cycleNumber || index + 1}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          {cycle.startDate
                            ? new Date(cycle.startDate).toLocaleDateString(
                                "id-ID",
                                { day: "numeric", month: "short" }
                              )
                            : "N/A"}{" "}
                          -{" "}
                          {cycle.endDate
                            ? new Date(cycle.endDate).toLocaleDateString(
                                "id-ID",
                                { day: "numeric", month: "short" }
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <Badge
                        variant={cycle.isCompleted ? "default" : "secondary"}
                        className="px-2 py-1 md:px-3 md:py-1 text-xs"
                      >
                        {cycle.isCompleted ? "Selesai" : "Berlangsung"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <Calendar className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm md:text-base">
                    Belum ada data siklus
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg glass-card">
            <CardHeader className="bg-gray-50/50 px-4 py-4 md:px-6 md:py-6 border-b border-gray-100">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Zap className="h-4 w-4 md:h-5 md:w-5 mr-2 text-purple-600" />
                Event Mendatang
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents
                    .slice(0, 3)
                    .map((event: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200 gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm md:text-base">
                            {event.title || "Event"}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">
                            {event.date
                              ? new Date(event.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-purple-200 text-purple-700 bg-white px-2 py-1 md:px-3 md:py-1 text-xs"
                        >
                          {event.type || "Event"}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <Zap className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm md:text-base">
                    Tidak ada event mendatang
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <Card className="mb-8 border-0 shadow-lg glass-card">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-4 md:px-6 md:py-6">
            <CardTitle className="flex items-center text-base md:text-lg">
              <Activity className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
              Metrik Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              <div className="text-center p-3 md:p-6 bg-blue-50/50 rounded-xl md:rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-200">
                <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-1 md:mb-2">
                  {healthMetrics?.averageSleep || 0}h
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-700">
                  Rata-rata Tidur
                </p>
              </div>
              <div className="text-center p-3 md:p-6 bg-cyan-50/50 rounded-xl md:rounded-2xl border border-cyan-100 hover:shadow-md transition-all duration-200">
                <div className="text-2xl md:text-4xl font-bold text-cyan-600 mb-1 md:mb-2">
                  {healthMetrics?.averageWater || 0}L
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-700">
                  Rata-rata Air
                </p>
              </div>
              <div className="text-center p-3 md:p-6 bg-teal-50/50 rounded-xl md:rounded-2xl border border-teal-100 hover:shadow-md transition-all duration-200 col-span-2 md:col-span-1">
                <div className="text-2xl md:text-4xl font-bold text-teal-600 mb-1 md:mb-2">
                  {healthMetrics?.moodScore || 0}/10
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-700">
                  Skor Mood
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <Card className="border-0 shadow-lg glass-card">
            <CardHeader className="bg-gray-50/50 px-4 py-4 md:px-6 md:py-6 border-b border-gray-100">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Award className="h-4 w-4 md:h-5 md:w-5 mr-2 text-yellow-600" />
                Pencapaian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {achievements.map((achievement: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center p-3 md:p-4 bg-yellow-50/50 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow duration-200 gap-2"
                  >
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-yellow-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800 text-sm md:text-base">
                        {achievement.title || "Pencapaian"}
                      </p>
                      <p className="text-xs md:text-sm text-yellow-600 mt-1">
                        {achievement.description || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
