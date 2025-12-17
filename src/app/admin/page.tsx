"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { PageLoading } from "@/components/ui/loading";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Clock,
    FileText,
    PieChart,
    TrendingUp,
    UserPlus,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalArticles: number;
  publishedArticles: number;
  totalCycles: number;
  activeCycles: number;
  dailyLogsToday: number;
  dailyLogsThisWeek: number;
  userGrowth: {
    thisMonth: number;
    lastMonth: number;
    percentage: number;
  };
  articleGrowth: {
    thisMonth: number;
    lastMonth: number;
    percentage: number;
  };
  cycleGrowth: {
    thisMonth: number;
    lastMonth: number;
    percentage: number;
  };
}

interface ActivityData {
  id: string;
  user: string;
  action: string;
  time: string;
  type: string;
  details?: any;
}

interface SystemMetrics {
  serverUptime: string;
  serverUptimePercentage: number;
  responseTime: number;
  databaseHealth: string;
  apiCallsToday: number;
  totalUsers: number;
  totalArticles: number;
  errorRate: number;
  lastHealthCheck: string;
}

interface HistoricalData {
  month: string;
  users: number;
  articles: number;
  cycles: number;
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  // Export feature removed - state no longer needed
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, activitiesRes, metricsRes, historicalRes] =
        await Promise.all([
          fetch("/api/admin/analytics", { cache: "no-store" }),
          fetch("/api/admin/activities", { cache: "no-store" }),
          fetch("/api/admin/system-metrics", { cache: "no-store" }),
          fetch("/api/admin/analytics/historical", { cache: "no-store" }),
        ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.analytics);
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.activities);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setSystemMetrics(metricsData.metrics);
      }

      if (historicalRes.ok) {
        const historicalDataResponse = await historicalRes.json();
        setHistoricalData(historicalDataResponse.historicalData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalytics = () => {
    setShowAnalyticsModal(true);
  };

  // Export handler removed

  // Enhanced stats with real data
  const stats = [
    {
      label: "Total Pengguna",
      value: analytics?.totalUsers.toLocaleString() || "0",
      change: analytics
        ? `${
            analytics.userGrowth.percentage >= 0 ? "+" : ""
          }${analytics.userGrowth.percentage.toFixed(1)}%`
        : "+0.0%",
      changeType:
        analytics && analytics.userGrowth.percentage >= 0
          ? "increase"
          : "decrease",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
      shadowColor: "shadow-blue-500/10",
    },
    {
      label: "Artikel Aktif",
      value: analytics?.publishedArticles.toString() || "0",
      change: analytics
        ? `${
            analytics.articleGrowth.percentage >= 0 ? "+" : ""
          }${analytics.articleGrowth.percentage.toFixed(1)}%`
        : "+0.0%",
      changeType:
        analytics && analytics.articleGrowth.percentage >= 0
          ? "increase"
          : "decrease",
      icon: FileText,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      textColor: "text-emerald-700",
      shadowColor: "shadow-emerald-500/10",
    },
    {
      label: "Siklus Aktif",
      value: analytics?.activeCycles.toString() || "0",
      change: analytics
        ? `${
            analytics.cycleGrowth.percentage >= 0 ? "+" : ""
          }${analytics.cycleGrowth.percentage.toFixed(1)}%`
        : "+0.0%",
      changeType:
        analytics && analytics.cycleGrowth.percentage >= 0
          ? "increase"
          : "decrease",
      icon: Activity,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      textColor: "text-pink-700",
      shadowColor: "shadow-pink-500/10",
    },
    {
      label: "Log Harian Hari Ini",
      value: analytics?.dailyLogsToday.toString() || "0",
      change: "+0.0%", // Will be calculated when we have historical data
      changeType: "increase",
      icon: Calendar,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      textColor: "text-purple-700",
      shadowColor: "shadow-purple-500/10",
    },
  ];

  const recentActivities =
    activities.length > 0
      ? activities
      : [
          {
            id: "1",
            user: "Loading...",
            action: "Fetching activities...",
            time: "Just now",
            type: "loading",
          },
        ];

  const systemMetricsData = [
    {
      label: "Waktu Aktif Server",
      value: systemMetrics?.serverUptime || "Loading...",
      status: "excellent",
    },
    {
      label: "Waktu Respons",
      value: `${systemMetrics?.responseTime || 0}ms`,
      status:
        systemMetrics && systemMetrics.responseTime < 100 ? "good" : "warning",
    },
    {
      label: "Kesehatan Database",
      value: systemMetrics?.databaseHealth || "Checking...",
      status:
        systemMetrics?.databaseHealth === "Healthy" ? "excellent" : "error",
    },
    {
      label: "Panggilan API Hari Ini",
      value: systemMetrics?.apiCallsToday.toLocaleString() || "0",
      status: "good",
    },
  ];

  useEffect(() => {
    // Mobile detection
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Filter data for mobile - show only current month
  const getFilteredData = () => {
    if (!isMobile || historicalData.length === 0) {
      return historicalData;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });

    return historicalData.filter((item) => item.month === currentMonth);
  };

  if (isLoading) {
    return <PageLoading text="Memuat dashboard..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-0 mb-8 p-8 text-white shadow-2xl shadow-pink-500/20 border border-white/10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm">
                Selamat Datang Kembali! 👋
              </h1>
              <p className="text-pink-100 text-lg font-medium opacity-90 max-w-2xl">
                Berikut ringkasan aktivitas platform Anda hari ini. Pantau terus perkembangan komunitasmu!
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-inner">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-green-400/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                  <span className="text-sm font-bold text-green-100">Sistem Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid - More Fluid Layout */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <Card
              key={item.label}
              className={`group relative overflow-hidden border border-white/40 bg-white/60 backdrop-blur-xl hover:bg-white/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${item.shadowColor} cursor-pointer rounded-3xl`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
                  {item.label}
                </CardTitle>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div
                  className={`text-4xl font-extrabold mb-2 ${item.textColor} group-hover:scale-105 transition-transform duration-500 tracking-tight`}
                >
                  {item.value}
                </div>
                <div className="flex items-center text-sm font-medium bg-white/50 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                  {item.changeType === "increase" ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1 group-hover:scale-110 transition-transform" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1 group-hover:scale-110 transition-transform" />
                  )}
                  <span
                    className={
                      item.changeType === "increase"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  >
                    {item.change}
                  </span>
                  <span className="text-slate-500 ml-1">vs bulan lalu</span>
                </div>
              </CardContent>
              {/* Subtle animated border */}
              <div
                className={`absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left`}
              ></div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content - Fluid Layout */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Activity - Takes more space on larger screens */}
          <div className="xl:col-span-2">
            <Card className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6 border-b border-slate-100/50 bg-white/30">
                <CardTitle className="flex items-center space-x-4 text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/20">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold block">Aktivitas Terbaru</span>
                    <span className="text-sm font-normal text-slate-500">Pantau kegiatan pengguna secara real-time</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 cursor-default"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                        activity.type === "article"
                          ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-emerald-500/20"
                          : activity.type === "user"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/20"
                          : activity.type === "cycle"
                          ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-500/20"
                          : activity.type === "log"
                          ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-purple-500/20"
                          : "bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-slate-500/20"
                      }`}
                    >
                      {activity.type === "article" && (
                        <FileText className="h-7 w-7" />
                      )}
                      {activity.type === "user" && (
                        <UserPlus className="h-7 w-7" />
                      )}
                      {activity.type === "cycle" && (
                        <Activity className="h-7 w-7" />
                      )}
                      {activity.type === "log" && (
                        <Calendar className="h-7 w-7" />
                      )}
                      {activity.type === "loading" && (
                        <Clock className="h-7 w-7" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                        {activity.user}
                      </p>
                      <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors truncate">
                        {activity.action}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 group-hover:bg-white group-hover:border-slate-300 transition-colors">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* System Status - Compact and modern */}
          <div>
            <Card className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden h-full">
              <CardHeader className="pb-6 border-b border-slate-100/50 bg-white/30">
                <CardTitle className="flex items-center space-x-4 text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold block">Status Sistem</span>
                    <span className="text-sm font-normal text-slate-500">Kesehatan server & database</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {systemMetricsData.map((metric, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white transition-all duration-300 border border-white/50 hover:border-slate-200 hover:shadow-md"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors block mb-1">
                          {metric.label}
                        </span>
                        <div className="text-lg font-extrabold text-slate-900">
                          {metric.value}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full shadow-lg border-2 border-white ${
                          metric.status === "excellent"
                            ? "bg-emerald-500 shadow-emerald-500/40"
                            : metric.status === "good"
                            ? "bg-yellow-500 shadow-yellow-500/40"
                            : "bg-red-500 shadow-red-500/40"
                        } group-hover:scale-125 transition-transform duration-300`}
                      ></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Performance Overview - Full Width */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <Card className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 border-b border-slate-100/50 bg-white/30">
            <CardTitle className="flex items-center space-x-4 text-slate-800">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg shadow-orange-500/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold block">
                  Performance Overview {currentYear}
                </span>
                <span className="text-sm font-normal text-slate-500">Analisis pertumbuhan pengguna dan konten</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* User Growth Chart */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-800 flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></div>
                  <span>Pertumbuhan Pengguna</span>
                  {isMobile && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                      Bulan Ini
                    </span>
                  )}
                </h4>
                <div className="bg-gradient-to-br from-white/50 to-white/80 p-6 rounded-3xl border border-white/60 shadow-inner">
                  <ChartContainer
                    config={{
                      users: {
                        label: "Pengguna Baru",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-72 w-full min-w-0"
                  >
                    {historicalData.length > 0 ? (
                      <LineChart data={getFilteredData()}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-20"
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="month" 
                          className="text-xs font-medium text-slate-500" 
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          className="text-xs font-medium text-slate-500" 
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent className="bg-white/90 backdrop-blur-md border-none shadow-xl rounded-xl" />} 
                        />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="url(#userGradient)"
                          strokeWidth={4}
                          dot={{ fill: "#3b82f6", strokeWidth: 4, r: 6, stroke: "white" }}
                          activeDot={{
                            r: 8,
                            stroke: "#3b82f6",
                            strokeWidth: 4,
                            fill: "white"
                          }}
                        />
                        <defs>
                          <linearGradient
                            id="userGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <div className="text-center">
                          <div className="bg-slate-100 p-4 rounded-full inline-block mb-3">
                            <Clock className="h-8 w-8 text-slate-300" />
                          </div>
                          <p className="text-sm font-medium">Memuat data...</p>
                        </div>
                      </div>
                    )}
                  </ChartContainer>
                </div>
              </div>

              {/* Article Growth Chart */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-800 flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm"></div>
                  <span>Artikel & Siklus</span>
                </h4>
                <div className="bg-gradient-to-br from-white/50 to-white/80 p-6 rounded-3xl border border-white/60 shadow-inner">
                  <ChartContainer
                    config={{
                      articles: {
                        label: "Artikel",
                        color: "hsl(var(--chart-2))",
                      },
                      cycles: {
                        label: "Siklus",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-72 w-full min-w-0"
                  >
                    <BarChart data={getFilteredData()} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-20"
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs font-medium text-slate-500" 
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        className="text-xs font-medium text-slate-500" 
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent className="bg-white/90 backdrop-blur-md border-none shadow-xl rounded-xl" />} 
                        cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 8 }}
                      />
                      <Bar
                        dataKey="articles"
                        fill="url(#articleGradient)"
                        radius={[6, 6, 6, 6]}
                        barSize={20}
                      />
                      <Bar
                        dataKey="cycles"
                        fill="url(#cycleGradient)"
                        radius={[6, 6, 6, 6]}
                        barSize={20}
                      />
                      <defs>
                        <linearGradient
                          id="articleGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient
                          id="cycleGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#db2777" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>

            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-blue-700 mb-1 uppercase tracking-wider">
                      Aktivitas Harian
                    </p>
                    <p className="text-4xl font-extrabold text-blue-900 group-hover:scale-105 transition-transform">
                      {analytics?.dailyLogsToday || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-semibold bg-blue-100/50 px-3 py-1.5 rounded-full w-fit">
                  Log harian tercatat hari ini
                </p>
              </div>

              <div className="group bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-emerald-700 mb-1 uppercase tracking-wider">
                      Artikel
                    </p>
                    <p className="text-4xl font-extrabold text-emerald-900 group-hover:scale-105 transition-transform">
                      {analytics?.publishedArticles || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-emerald-600 font-semibold bg-emerald-100/50 px-3 py-1.5 rounded-full w-fit">
                  Dari {analytics?.totalArticles || 0} artikel total
                </p>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-100 hover:shadow-lg hover:shadow-pink-500/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-pink-700 mb-1 uppercase tracking-wider">
                      Siklus Aktif
                    </p>
                    <p className="text-4xl font-extrabold text-pink-900 group-hover:scale-105 transition-transform">
                      {analytics?.activeCycles || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-pink-600 font-semibold bg-pink-100/50 px-3 py-1.5 rounded-full w-fit">
                  Siklus yang sedang dilacak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
