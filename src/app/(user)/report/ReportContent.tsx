"use client";

import { Navbar } from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/ui/loading";
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
  Home,
  Moon,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
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

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading || !analysis) {
    return <PageLoading text="Memuat laporan kesehatan..." />;
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
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Laporan Kesehatan
            </h1>
            <p className="text-gray-600 text-lg">
              Ringkasan kesehatan reproduksi Anda
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 h-12 border-2 border-gray-200 hover:border-indigo-300">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                <SelectItem value="12months">12 Bulan Terakhir</SelectItem>
              </SelectContent>
            </Select>

            {/* Download button removed */}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-blue-400 to-blue-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                Siklus Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                Hari ke-{analysis.cycleDay}
              </div>
              <Badge
                className={`${getPhaseColor(
                  analysis.currentPhase
                )} px-3 py-1 text-sm font-semibold`}
              >
                {getPhaseName(analysis.currentPhase)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-green-400 to-green-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                Rata-rata Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analysis.avgCycleLength} hari
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${regularityStatus.color}`}
                >
                  {regularityStatus.icon} {regularityStatus.text}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-red-400 to-red-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <Activity className="h-5 w-5 text-red-600" />
                </div>
                Rata-rata Haid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {analysis.avgPeriodLength} hari
              </div>
              <p className="text-sm font-medium text-green-600">
                ✓ Normal (3-7 hari)
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Moon className="h-5 w-5 text-purple-600" />
                </div>
                Masa Subur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold mb-2 ${
                  analysis.fertileWindow.isActive
                    ? "text-purple-600"
                    : "text-gray-400"
                }`}
              >
                {analysis.fertileWindow.isActive ? "Aktif" : "Tidak Aktif"}
              </div>
              <p className="text-sm font-medium text-gray-600">
                Hari {analysis.fertileWindow.start}-{analysis.fertileWindow.end}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Health Alerts */}
        {analysis.healthAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Peringatan Kesehatan</h2>
            <div className="space-y-3">
              {analysis.healthAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  className={
                    alert.severity === "high"
                      ? "border-red-200 bg-red-50"
                      : alert.severity === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50"
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{alert.title}:</strong> {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cycle Length Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Panjang Siklus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={cycles.map((cycle, index) => ({
                    month: `Bulan ${index + 1}`,
                    cycleLength:
                      Math.floor(
                        (new Date(cycle.startDate).getTime() -
                          new Date(
                            cycles[index + 1]?.startDate || cycle.startDate
                          ).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) || 28,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[20, 40]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cycleLength"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="Panjang Siklus (hari)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Symptom Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Gejala</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Symptom Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>Gejala Paling Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.symptomFrequency.slice(0, 8).map((symptom, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{symptom.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-600 h-2 rounded-full"
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
                      <span className="text-sm text-gray-600 w-8">
                        {symptom.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mood Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Analisis Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.moodFrequency.map((mood, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{mood.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
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
                      <span className="text-sm text-gray-600 w-8">
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-600" />
              Rekomendasi Kesehatan Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === "high"
                        ? "Penting"
                        : rec.priority === "medium"
                        ? "Sedang"
                        : "Ringan"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cycle History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Riwayat Siklus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">No</th>
                    <th className="text-left p-2">Mulai</th>
                    <th className="text-left p-2">Selesai</th>
                    <th className="text-left p-2">Durasi</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.slice(0, 6).map((cycle, index) => (
                    <tr key={cycle.id} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        {new Date(cycle.startDate).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-2">
                        {cycle.endDate
                          ? new Date(cycle.endDate).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="p-2">
                        {cycle.endDate
                          ? Math.floor(
                              (new Date(cycle.endDate).getTime() -
                                new Date(cycle.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : "-"}{" "}
                        hari
                      </td>
                      <td className="p-2">
                        {cycle.isAbnormal ? (
                          <Badge className="bg-red-100 text-red-800">
                            Abnormal
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">
                            Normal
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/analysis">
              <FileText className="h-4 w-4 mr-2" />
              Lihat Analisis Lengkap
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
