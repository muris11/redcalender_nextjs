"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import {
    Activity,
    AlertTriangle,
    Calendar,
    FileText,
    Heart,
    Moon,
    TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  isAbnormal: boolean;
}

interface AnalysisData {
  cycleDay: number;
  currentPhase: string;
  avgCycleLength: number;
  avgPeriodLength: number;
  fertileWindow: {
    isActive: boolean;
    start: number;
    end: number;
  };
  healthAlerts: {
    title: string;
    message: string;
    severity: "low" | "medium" | "high";
  }[];
  symptomFrequency: {
    name: string;
    count: number;
  }[];
  moodFrequency: {
    name: string;
    count: number;
  }[];
  recommendations: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }[];
}

export default function ReportContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  /* PDF download support removed - state removed */
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    // Set page title
    // document.title = "Laporan Kesehatan - Red Calendar"; // Handled by metadata

    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadReportData();
  }, [isAuthenticated, isLoading, router, selectedPeriod]);

  const loadReportData = async () => {
    if (!user?.id) return;

    try {
      setIsDataLoading(true);
      const resp = await fetch(
        `/api/user/report?userId=${user.id}&period=${selectedPeriod}`
      );
      if (!resp.ok) {
        throw new Error("Failed to fetch report data");
      }
      const data = await resp.json();

      setCycles(data.cycles);
      setAnalysis(data.report);
    } catch (error) {
      console.error("Error loading report data:", error);
      // Fallback to empty data if API fails
      setCycles([]);
      setAnalysis(null);
    } finally {
      setIsDataLoading(false);
    }
  };

  /* PDF download support removed */

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "menstrual":
        return "bg-red-100 text-red-800";
      case "follicular":
        return "bg-green-100 text-green-800";
      case "ovulation":
        return "bg-purple-100 text-purple-800";
      case "luteal":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPhaseName = (phase: string) => {
    switch (phase) {
      case "menstrual":
        return "Menstruasi";
      case "follicular":
        return "Folikuler";
      case "ovulation":
        return "Ovulasi";
      case "luteal":
        return "Luteal";
      default:
        return phase;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pieColors = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading || !analysis) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <ChartSkeleton />
      </main>
    );
  }

  const regularityStatus = {
    text:
      analysis.avgCycleLength >= 21 && analysis.avgCycleLength <= 35
        ? "Teratur"
        : "Tidak Teratur",
    color:
      analysis.avgCycleLength >= 21 && analysis.avgCycleLength <= 35
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800",
    icon:
      analysis.avgCycleLength >= 21 && analysis.avgCycleLength <= 35
        ? "✅"
        : "⚠️",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <Heading level="1" size="heading-xl" className="mb-2">
          Laporan Kesehatan
        </Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Ringkasan kesehatan reproduksi Anda
        </Text>
      </div>

      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Pilih periode" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
              <SelectItem value="12months">12 Bulan Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <Text variant="display-sm" className="font-bold text-primary mb-1">
                Hari {analysis.cycleDay}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Siklus Saat Ini
              </Text>
              <Badge className={`${getPhaseColor(analysis.currentPhase)} text-xs`}>
                {getPhaseName(analysis.currentPhase)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <Text variant="display-sm" className="font-bold text-green-600 mb-1">
                {analysis.avgCycleLength}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Rata-rata Siklus
              </Text>
              <Text variant="label-xs" className={regularityStatus.color}>
                {regularityStatus.text}
              </Text>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <Text variant="display-sm" className="font-bold text-red-600 mb-1">
                {analysis.avgPeriodLength}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Rata-rata Haid
              </Text>
              <Text variant="label-xs" className="text-green-600">
                Normal
              </Text>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <Text variant="display-sm" className={`font-bold mb-1 ${analysis.fertileWindow.isActive ? "text-purple-600" : "text-muted-foreground"}`}>
                {analysis.fertileWindow.isActive ? "Aktif" : "Tidak"}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Masa Subur
              </Text>
              <Text variant="label-xs" className="text-muted-foreground">
                Hari {analysis.fertileWindow.start}-{analysis.fertileWindow.end}
              </Text>
            </CardContent>
          </Card>
        </div>

        {/* Health Alerts */}
        {analysis.healthAlerts.length > 0 && (
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
              Peringatan Kesehatan
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {analysis.healthAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  className={`${
                    alert.severity === "high"
                      ? "border-red-200 bg-red-50"
                      : alert.severity === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50"
                  } border-l-4`}
                >
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <AlertDescription className="text-sm sm:text-base">
                    <strong className="font-semibold">{alert.title}:</strong>{" "}
                    {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* Cycle Length Trend */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800">
                Tren Panjang Siklus
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 sm:h-72 lg:h-80 xl:h-96">
                {cycles.length < 2 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Calendar className="h-12 w-12 mb-4 text-pink-300" />
                    <p className="text-center text-sm sm:text-base font-medium">
                      Belum ada data yang cukup
                    </p>
                    <p className="text-center text-xs sm:text-sm text-gray-400 mt-1">
                      Minimal 2 siklus diperlukan untuk menampilkan tren
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[...cycles].reverse().map((cycle, index, arr) => {
                        // Calculate cycle length: difference to next cycle
                        let cycleLength = analysis?.avgCycleLength || 28;
                        if (index < arr.length - 1) {
                          const nextCycle = arr[index + 1];
                          const days = Math.floor(
                            (new Date(nextCycle.startDate).getTime() -
                              new Date(cycle.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          if (days > 0 && days < 60) cycleLength = days;
                        }
                        return {
                          month: `Siklus ${index + 1}`,
                          cycleLength,
                        };
                      })}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        fontSize={12}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [`${value} hari`, "Panjang Siklus"]}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="cycleLength"
                        stroke="#ec4899"
                        strokeWidth={2}
                        name="Panjang Siklus (hari)"
                        dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#ec4899", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              {cycles.length >= 2 && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Rata-rata: <span className="font-semibold text-theme">{analysis?.avgCycleLength || 28} hari</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Symptom Distribution */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800">
                Distribusi Gejala
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 sm:h-72 lg:h-80 xl:h-96">
                {!analysis.symptomFrequency || analysis.symptomFrequency.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Activity className="h-12 w-12 mb-4 text-gray-300" />
                    <p className="text-center text-sm sm:text-base font-medium">
                      Belum ada data gejala
                    </p>
                    <p className="text-center text-xs sm:text-sm text-gray-400 mt-1">
                      Catat gejala harian untuk melihat distribusi
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.symptomFrequency.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analysis.symptomFrequency
                          .slice(0, 5)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={pieColors[index % pieColors.length]}
                            />
                          ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* Symptom Frequency */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-theme" />
                Gejala Paling Umum
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {analysis.symptomFrequency.slice(0, 8).map((symptom, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-800 flex-1 mr-3">
                      {symptom.name}
                    </span>
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 shrink-0">
                      <div className="w-16 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (symptom.count /
                                Math.max(
                                  ...analysis.symptomFrequency.map(
                                    (s) => s.count
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 font-medium w-6 sm:w-8 text-right">
                        {symptom.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mood Analysis */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-theme" />
                Analisis Mood
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {analysis.moodFrequency.map((mood, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-800 flex-1 mr-3">
                      {mood.name}
                    </span>
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 shrink-0">
                      <div className="w-16 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-theme h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (mood.count /
                                Math.max(
                                  ...analysis.moodFrequency.map((m) => m.count)
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 font-medium w-6 sm:w-8 text-right">
                        {mood.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-card mb-6 sm:mb-8 lg:mb-10">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-theme" />
              Rekomendasi Kesehatan Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {analysis.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md hover:border-pink-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight flex-1 mr-2">
                      {rec.title}
                    </h3>
                    <Badge
                      className={`${getPriorityColor(
                        rec.priority
                      )} px-2 py-1 text-xs font-semibold shrink-0`}
                    >
                      {rec.priority === "high"
                        ? "Penting"
                        : rec.priority === "medium"
                        ? "Sedang"
                        : "Ringan"}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cycle History */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Riwayat Siklus
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-xs sm:text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mulai
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Selesai
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durasi
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cycles.slice(0, 6).map((cycle, index) => (
                      <tr key={cycle.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(cycle.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cycle.endDate
                            ? new Date(cycle.endDate).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cycle.endDate
                            ? Math.floor(
                                (new Date(cycle.endDate).getTime() -
                                  new Date(cycle.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            : "-"}{" "}
                          hari
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {cycle.isAbnormal ? (
                            <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1">
                              Abnormal
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              Normal
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
    </main>
  );
}
