"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
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
import { toast } from "sonner";

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
          toast.error("Gagal memuat data dashboard", {
            description: "Silakan coba refresh halaman atau periksa koneksi internet Anda.",
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Koneksi bermasalah", {
          description: "Tidak dapat terhubung ke server. Silakan coba lagi.",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isLoading, router, user?.id]);

  // Update menstruating state when dashboard data loads
  useEffect(() => {
    // Use hasActivePeriod from API to determine if user is currently menstruating
    if (dashboardData?.hasActivePeriod) {
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
      const data = await response.json();
      if (response.ok) {
        setCurrentlyMenstruating(true);
        toast.success("Berhasil Mencatat", {
          description: "Haid Anda telah ditandai dimulai hari ini.",
        });
        // Refresh dashboard data
        const dashResponse = await fetch(`/api/user/dashboard?userId=${user.id}`);
        const dashData = await dashResponse.json();
        if (dashResponse.ok) {
          setDashboardData(dashData.dashboard);
        }
      } else {
        toast.error("Gagal Mencatat", {
          description: data.error || "Terjadi kesalahan saat menandai mulai haid.",
        });
      }
    } catch (error) {
      console.error('Error marking period start:', error);
      toast.error("Terjadi Kesalahan", {
        description: "Tidak dapat terhubung ke server. Silakan coba lagi.",
      });
    } finally {
      setIsMarkingPeriod(false);
    }
  };

  // Handler untuk menandai haid selesai
  const handleMarkPeriodEnd = async () => {
    if (!user?.id) return;
    
    // Check if currently menstruating before attempting to mark end
    if (!currentlyMenstruating) {
      toast.warning("Tidak Ada Haid Aktif", {
        description: "Anda belum menandai mulai haid. Silakan tandai mulai haid terlebih dahulu.",
      });
      return;
    }
    
    setIsMarkingPeriod(true);
    try {
      const response = await fetch(`/api/user/cycles?userId=${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endDate: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentlyMenstruating(false);
        toast.success("Berhasil Mencatat", {
          description: "Haid Anda telah ditandai selesai. Data siklus telah diperbarui.",
        });
        // Refresh dashboard data
        const dashResponse = await fetch(`/api/user/dashboard?userId=${user.id}`);
        const dashData = await dashResponse.json();
        if (dashResponse.ok) {
          setDashboardData(dashData.dashboard);
        }
      } else {
        // Handle specific error messages
        if (data.error === "No active period found") {
          toast.warning("Tidak Ada Haid Aktif", {
            description: "Anda belum menandai mulai haid. Silakan tandai mulai haid terlebih dahulu.",
          });
          setCurrentlyMenstruating(false);
        } else {
          toast.error("Gagal Mencatat", {
            description: data.error || "Terjadi kesalahan saat menandai haid selesai.",
          });
        }
      }
    } catch (error) {
      console.error('Error marking period end:', error);
      toast.error("Terjadi Kesalahan", {
        description: "Tidak dapat terhubung ke server. Silakan coba lagi.",
      });
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
      <ResponsiveContainer>
        <DashboardSkeleton />
      </ResponsiveContainer>
    );
  }

  if (!dashboardData) {
    return (
      <ResponsiveContainer>
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </ResponsiveContainer>
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

  const upcomingEvents = dashboardData.upcomingEvents || [];
  const achievements = [];

  const statsCards = [
    {
      title: "Total Siklus",
      value: userStats?.totalCycles || 0,
      label: "Siklus tercatat",
      icon: Calendar,
      color: "text-primary",
      bgLight: "bg-primary/5"
    },
    {
      title: "Rata-rata Durasi",
      value: userStats?.averageCycleLength || 0,
      label: "Hari per siklus",
      icon: Activity,
      color: "text-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Log Harian",
      value: userStats?.totalLogs || 0,
      label: "Entri tercatat",
      icon: Heart,
      color: "text-rose-600",
      bgLight: "bg-rose-50"
    },
    {
      title: "Status Saat Ini",
      value: getPhaseLabel(healthMetrics?.currentPhase),
      label: "Fase siklus",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgLight: "bg-indigo-50",
      isText: true
    }
  ];

  return (
    <ResponsiveContainer maxWidth="tv" padding="lg">
      {/* Welcome Section - Clean & Simple */}
      <div className="mb-8">
        <Heading level={1} size="heading-xl" className="mb-2">
          Selamat datang, {user?.name || "User"}!
        </Heading>
        <Text variant="body-lg" className="text-muted-foreground">
          Pantau kesehatan reproduksi dan siklus menstruasi Anda
        </Text>
      </div>

      {/* Period Tracking Card - Simplified */}
      <Card className="mb-8 border-l-4 border-l-primary">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Text variant="heading-sm" weight="semibold">
                    Pelacakan Haid
                  </Text>
                  <Text variant="body-sm" className="text-muted-foreground">
                    {currentlyMenstruating 
                      ? "Anda sedang dalam periode haid" 
                      : "Tandai jika haid Anda dimulai hari ini"}
                  </Text>
                </div>
              </div>
            </div>
            {currentlyMenstruating ? (
              <Button 
                size="lg"
                onClick={handleMarkPeriodEnd}
                disabled={isMarkingPeriod}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                {isMarkingPeriod ? "Menyimpan..." : "Tandai Selesai"}
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={handleMarkPeriodStart}
                disabled={isMarkingPeriod}
                variant="default"
                className="text-white"
              >
                {isMarkingPeriod ? "Menyimpan..." : "Tandai Mulai Haid"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Clean Design */}
      <ResponsiveGrid cols={{ default: 2, md: 4, '5xl': 8 }} gap="md" className="mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.bgLight} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className={stat.isText ? "mb-2" : ""}>
                <Text 
                  variant={stat.isText ? "body-lg" : "heading-lg"} 
                  weight="bold"
                  className={stat.color}
                >
                  {stat.value}
                </Text>
              </div>
              <Text variant="label-sm" className="text-muted-foreground block mb-1">
                {stat.title}
              </Text>
              <Text variant="label-xs" className="text-muted-foreground/70">
                {stat.label}
              </Text>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Current Cycle Progress - Clean */}
      {recentCycles && recentCycles.length > 0 && (
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Siklus Saat Ini</CardTitle>
                <Text variant="body-sm" className="text-muted-foreground">
                  Hari ke-{recentCycles[0].currentDay || 0} dari {recentCycles[0].cycleLength || 28}
                </Text>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text variant="body-md" weight="medium">
                  Progress Siklus
                </Text>
                <Text variant="heading-sm" weight="bold" className="text-primary">
                  {Math.round(
                    ((recentCycles[0].currentDay || 0) /
                      (recentCycles[0].cycleLength || 28)) *
                      100
                  )}%
                </Text>
              </div>
              <Progress
                value={
                  ((recentCycles[0].currentDay || 0) /
                    (recentCycles[0].cycleLength || 28)) *
                  100
                }
                className="h-3"
              />
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  <Text variant="label-sm" className="text-muted-foreground">
                    Mulai:{" "}
                    {recentCycles[0].startDate
                      ? new Date(recentCycles[0].startDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })
                      : "N/A"}
                  </Text>
                </div>
                <Text variant="label-sm" weight="medium">
                  {recentCycles[0].daysUntilNextPeriod || 0} hari lagi
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Cycles & Upcoming Events */}
      <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="lg" className="mb-8">
        {/* Recent Cycles */}
        <Card className="h-full">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Siklus Terbaru</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentCycles && recentCycles.length > 0 ? (
              <div className="space-y-3">
                {recentCycles.slice(0, 3).map((cycle: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <Text variant="body-md" weight="semibold">
                        Siklus {cycle.cycleNumber || index + 1}
                      </Text>
                      <Text variant="label-sm" className="text-muted-foreground mt-1">
                        {cycle.startDate
                          ? new Date(cycle.startDate).toLocaleDateString("id-ID", { 
                              day: "numeric", 
                              month: "short" 
                            })
                          : "N/A"}{" "}
                        -{" "}
                        {cycle.endDate
                          ? new Date(cycle.endDate).toLocaleDateString("id-ID", { 
                              day: "numeric", 
                              month: "short" 
                            })
                          : (!cycle.isCompleted ? "Sekarang" : "N/A")}
                      </Text>
                    </div>
                    <Badge variant={cycle.isCompleted ? "default" : "secondary"}>
                      {cycle.isCompleted ? "Selesai" : "Berlangsung"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <Text variant="body-sm" className="text-muted-foreground">
                  Belum ada data siklus
                </Text>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="h-full">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Event Mendatang</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <Text variant="body-md" weight="semibold">
                        {event.title || "Event"}
                      </Text>
                      <Text variant="label-sm" className="text-muted-foreground mt-1">
                        {event.date
                          ? new Date(event.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                            })
                          : "N/A"}
                      </Text>
                    </div>
                    <Badge variant="outline">
                      {event.type || "Event"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <Text variant="body-sm" className="text-muted-foreground">
                  Tidak ada event mendatang
                </Text>
              </div>
            )}
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Health Metrics - Clean */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Metrik Kesehatan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ default: 2, md: 3 }} gap="md">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <Text variant="heading-lg" weight="bold" className="text-blue-600 mb-2 block">
                {healthMetrics?.averageSleep || 0}h
              </Text>
              <Text variant="body-sm" weight="medium" className="text-muted-foreground">
                Rata-rata Tidur
              </Text>
            </div>
            <div className="text-center p-6 bg-cyan-50 rounded-lg border border-cyan-100 hover:shadow-md transition-shadow">
              <Text variant="heading-lg" weight="bold" className="text-cyan-600 mb-2 block">
                {healthMetrics?.averageWater || 0}L
              </Text>
              <Text variant="body-sm" weight="medium" className="text-muted-foreground">
                Rata-rata Air
              </Text>
            </div>
            <div className="text-center p-6 bg-teal-50 rounded-lg border border-teal-100 hover:shadow-md transition-shadow col-span-2 md:col-span-1">
              <Text variant="heading-lg" weight="bold" className="text-teal-600 mb-2 block">
                {healthMetrics?.moodScore || 0}/10
              </Text>
              <Text variant="body-sm" weight="medium" className="text-muted-foreground">
                Skor Mood
              </Text>
            </div>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Achievements - Clean */}
      {achievements && achievements.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle>Pencapaian</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
              {achievements.map((achievement: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:shadow-md transition-shadow"
                >
                  <Award className="h-8 w-8 text-yellow-600 shrink-0" />
                  <div className="flex-1">
                    <Text variant="body-md" weight="semibold" className="text-yellow-800">
                      {achievement.title || "Pencapaian"}
                    </Text>
                    <Text variant="body-sm" className="text-yellow-600 mt-1">
                      {achievement.description || ""}
                    </Text>
                  </div>
                </div>
              ))}
            </ResponsiveGrid>
          </CardContent>
        </Card>
      )}
    </ResponsiveContainer>
  );
}
