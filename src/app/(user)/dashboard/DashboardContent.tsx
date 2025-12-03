"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/ui/loading";
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

  useEffect(() => {
    console.log("Dashboard: Auth state changed", {
      isLoading,
      isAuthenticated,
      userId: user?.id,
    });

    // Wait until auth state has initialized
    if (isLoading) {
      console.log("Dashboard: Waiting for auth to initialize...");
      return;
    }

    if (!isAuthenticated) {
      console.log("Dashboard: Not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    if (!user?.id) {
      console.error("Dashboard: User ID not found");
      setIsDataLoading(false);
      return;
    }

    console.log("Dashboard: Fetching dashboard data for user:", user.id);

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/user/dashboard?userId=${user?.id}`);
        const data = await response.json();

        if (response.ok) {
          console.log("Dashboard API response:", data); // Debug log
          setDashboardData(data.dashboard); // API returns { dashboard: {...} }
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

  // Show auth loading
  if (isLoading) {
    console.log("Dashboard: Rendering auth loading state");
    return <PageLoading text="Memuat autentikasi..." />;
  }

  if (!isAuthenticated) {
    console.log(
      "Dashboard: Not authenticated, showing nothing (will redirect)"
    );
    return null; // Will redirect
  }

  if (isDataLoading) {
    console.log("Dashboard: Rendering data loading state");
    return <PageLoading text="Memuat data dashboard..." />;
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
    averageSleep: 0, // TODO: Add to API
    averageWater: 0, // TODO: Add to API
    moodScore: 0, // TODO: Add to API
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
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Selamat datang kembali, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Pantau kesehatan reproduksi dan siklus menstruasi Anda di sini.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-pink-500 to-pink-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Siklus
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {userStats?.totalCycles || 0}
              </div>
              <p className="text-xs text-pink-100">Siklus tercatat</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-purple-500 to-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Rata-rata Durasi
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {userStats?.averageCycleLength || 0}
              </div>
              <p className="text-xs text-purple-100">Hari per siklus</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-rose-500 to-rose-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Log Harian
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {userStats?.totalLogs || 0}
              </div>
              <p className="text-xs text-rose-100">Entri tercatat</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-indigo-500 to-indigo-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Status Saat Ini
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1 capitalize">
                {healthMetrics?.currentPhase || "Tidak diketahui"}
              </div>
              <p className="text-xs text-indigo-100">Fase siklus</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Cycle Progress */}
        {recentCycles && recentCycles.length > 0 && (
          <Card className="mb-8 border-0 shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-pink-500 to-purple-500 p-6 text-white">
              <CardTitle className="flex items-center text-xl">
                <Target className="h-6 w-6 mr-2" />
                Siklus Saat Ini
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Hari ke-{recentCycles[0].currentDay || 0} dari{" "}
                    {recentCycles[0].cycleLength || 28}
                  </span>
                  <span className="text-2xl font-bold text-pink-600">
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
                    className="h-4"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>
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
                    <span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Cycles */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                Siklus Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recentCycles && recentCycles.length > 0 ? (
                <div className="space-y-3">
                  {recentCycles.slice(0, 3).map((cycle: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-linear-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          Siklus {cycle.cycleNumber || index + 1}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
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
                        className="px-3 py-1"
                      >
                        {cycle.isCompleted ? "Selesai" : "Berlangsung"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada data siklus</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                Event Mendatang
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents
                    .slice(0, 3)
                    .map((event: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {event.title || "Event"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
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
                          className="border-purple-200 text-purple-700 bg-white px-3 py-1"
                        >
                          {event.type || "Event"}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada event mendatang</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Metrik Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {healthMetrics?.averageSleep || 0}h
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Rata-rata Tidur
                </p>
              </div>
              <div className="text-center p-6 bg-cyan-50 rounded-2xl border border-cyan-100 hover:shadow-md transition-all duration-200">
                <div className="text-4xl font-bold text-cyan-600 mb-2">
                  {healthMetrics?.averageWater || 0}L
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Rata-rata Air
                </p>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-2xl border border-teal-100 hover:shadow-md transition-all duration-200">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {healthMetrics?.moodScore || 0}/10
                </div>
                <p className="text-sm font-medium text-gray-700">Skor Mood</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Pencapaian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <Award className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {achievement.title || "Pencapaian"}
                      </p>
                      <p className="text-sm text-yellow-600">
                        {achievement.description || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push("/log")}
              className="h-24 flex flex-col items-center justify-center bg-linear-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
            >
              <Heart className="h-8 w-8 mb-2" />
              <span className="text-base font-semibold">Log Harian</span>
            </Button>
            <Button
              onClick={() => router.push("/calender")}
              className="h-24 flex flex-col items-center justify-center bg-linear-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-base font-semibold">Kalender</span>
            </Button>
            <Button
              onClick={() => router.push("/analysis")}
              className="h-24 flex flex-col items-center justify-center bg-linear-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
            >
              <TrendingUp className="h-8 w-8 mb-2" />
              <span className="text-base font-semibold">Analisis</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
