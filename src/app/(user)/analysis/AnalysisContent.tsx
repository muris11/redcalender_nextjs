"use client";

import { Navbar } from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/ui/loading";
import { useAuthStore } from "@/store/authStore";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Droplets,
  Heart,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CycleData {
  month: string;
  cycleLength: number;
  periodLength: number;
  startDate: string;
}

interface SymptomFrequency {
  name: string;
  count: number;
  category: string;
}

interface MoodFrequency {
  name: string;
  count: number;
}

export default function AnalysisContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [symptomData, setSymptomData] = useState<SymptomFrequency[]>([]);
  const [moodData, setMoodData] = useState<MoodFrequency[]>([]);
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [avgPeriodLength, setAvgPeriodLength] = useState(6);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadAnalysisData();
  }, [isAuthenticated, isLoading, router]);

  const loadAnalysisData = async () => {
    if (!user?.id) return;

    try {
      setIsDataLoading(true);
      const response = await fetch(`/api/user/analysis?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analysis data");
      }
      const data = await response.json();

      // Transform data for charts
      const transformedCycleData = transformCycleData(data.cycles);
      const transformedSymptomData = transformSymptomData(
        data.analysis.symptomFrequency
      );
      const transformedMoodData = data.analysis.moodFrequency;

      setCycleData(transformedCycleData);
      setSymptomData(transformedSymptomData);
      setMoodData(transformedMoodData);
      setAvgCycleLength(data.analysis.avgCycleLength);
      setAvgPeriodLength(data.analysis.avgPeriodLength);
    } catch (error) {
      console.error("Error loading analysis data:", error);
      // Fallback to empty data if API fails
      setCycleData([]);
      setSymptomData([]);
      setMoodData([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  const transformCycleData = (cycles: any[]): CycleData[] => {
    return cycles.slice(0, 6).map((cycle, index) => {
      const date = new Date(cycle.startDate);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Ags",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      const month = monthNames[date.getMonth()];

      // Calculate cycle length (difference from previous cycle)
      let cycleLength = 28; // default
      if (index < cycles.length - 1) {
        const nextCycle = cycles[index + 1];
        const days = Math.floor(
          (new Date(nextCycle.startDate).getTime() - date.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (days > 0) cycleLength = days;
      }

      // Calculate period length
      let periodLength = 6; // default
      if (cycle.startDate && cycle.endDate) {
        periodLength = Math.floor(
          (new Date(cycle.endDate).getTime() - date.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      return {
        month,
        cycleLength,
        periodLength,
        startDate: cycle.startDate,
      };
    });
  };

  const transformSymptomData = (symptoms: any[]): SymptomFrequency[] => {
    return symptoms.map((symptom) => ({
      name: symptom.name,
      count: symptom.count,
      category: getSymptomCategory(symptom.name),
    }));
  };

  const getSymptomCategory = (symptomName: string): string => {
    const painSymptoms = ["Sakit", "Kram", "Nyeri"];
    const skinSymptoms = ["Jerawat", "Kulit"];
    const physicalSymptoms = ["Kelelahan", "Lelah", "Mual"];

    if (painSymptoms.some((s) => symptomName.includes(s))) return "pain";
    if (skinSymptoms.some((s) => symptomName.includes(s))) return "skin";
    if (physicalSymptoms.some((s) => symptomName.includes(s)))
      return "physical";
    return "other";
  };

  const isAbnormal = avgCycleLength > 35 || avgCycleLength < 21;
  const isVariationHigh =
    Math.max(...cycleData.map((c) => c.cycleLength)) -
      Math.min(...cycleData.map((c) => c.cycleLength)) >
    9;

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return <PageLoading text="Memuat data analisis..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Analisis Kesehatan
          </h1>
          <p className="text-gray-600 text-lg">
            Pantau tren siklus dan kesehatan Anda
          </p>
        </div>

        {(isAbnormal || isVariationHigh) && (
          <Alert className="mb-8 bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <AlertDescription className="text-orange-900 text-base">
              <strong className="font-bold">⚠️ Perhatian:</strong>{" "}
              {isVariationHigh
                ? "Siklus Anda fluktuatif melebihi variasi tipikal. Penting untuk tetap waspada. Jika Anda merasa khawatir, jangan ragu untuk berbicara dengan penyedia perawatan kesehatan."
                : "Rata-rata siklus Anda berada di luar rentang normal (21-35 hari). Disarankan untuk berkonsultasi dengan dokter."}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-blue-400 to-blue-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                Rata-rata Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {avgCycleLength} hari
                </span>
                {isAbnormal && (
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                )}
              </div>
              <p
                className={`text-sm font-medium mt-2 ${
                  isAbnormal ? "text-orange-600" : "text-green-600"
                }`}
              >
                {isAbnormal
                  ? "⚠️ Di luar rentang normal"
                  : "✓ Normal (21-35 hari)"}
              </p>
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
              <div className="text-3xl font-bold text-red-600">
                {avgPeriodLength} hari
              </div>
              <p className="text-sm font-medium text-green-600 mt-2">
                ✓ Normal (3-7 hari)
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-green-400 to-green-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                Variasi Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {Math.max(...cycleData.map((c) => c.cycleLength)) -
                  Math.min(...cycleData.map((c) => c.cycleLength))}{" "}
                hari
              </div>
              <p
                className={`text-sm font-medium mt-2 ${
                  isVariationHigh ? "text-orange-600" : "text-green-600"
                }`}
              >
                {isVariationHigh ? "⚠️ Variasi tinggi" : "✓ Variasi normal"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                Total Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {cycleData.length}
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">
                6 bulan terakhir
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cycle Length Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-pink-50 border-b border-pink-100">
              <CardTitle className="text-xl text-pink-900">
                📈 Tren Panjang Siklus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis domain={[20, 40]} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #ec4899",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cycleLength"
                    stroke="#ec4899"
                    strokeWidth={3}
                    name="Panjang Siklus (hari)"
                    dot={{ fill: "#ec4899", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={avgCycleLength}
                    stroke="#9ca3af"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Rata-rata"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Period Length Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="text-xl text-red-900">
                📊 Tren Durasi Haid
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis domain={[0, 10]} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #ef4444",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="periodLength"
                    fill="#ef4444"
                    name="Durasi Haid (hari)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Symptom and Mood Analysis */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="text-xl text-gray-800">
                💭 Analisis Gejala dan Suasana Hati
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mood Analysis */}
                <div>
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                    <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      💜
                    </span>
                    Suasana Hati
                  </h3>
                  <div className="flex flex-col space-y-4">
                    {moodData.slice(0, 5).map((mood, index) => (
                      <div
                        key={index}
                        className="p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-800">
                            {mood.name}
                          </span>
                          <span className="text-lg font-bold text-purple-600">
                            {mood.count}
                          </span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-3">
                          <div
                            className="bg-linear-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{
                              width: `${
                                (mood.count /
                                  Math.max(...moodData.map((m) => m.count))) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptom Analysis */}
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                    <span className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                      🩺
                    </span>
                    Gejala Fisik
                  </h3>
                  <div className="flex flex-col space-y-4">
                    {symptomData.slice(0, 5).map((symptom, index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-800">
                            {symptom.name}
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {symptom.count}
                          </span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-3">
                          <div
                            className="bg-linear-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{
                              width: `${
                                (symptom.count /
                                  Math.max(
                                    ...symptomData.map((s) => s.count)
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-green-50 to-teal-50 border-b border-green-100">
            <CardTitle className="text-xl text-gray-800">
              💡 Rekomendasi Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-2 border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-200">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Thermometer className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    Pantau Suhu Basal Tubuh
                  </h4>
                  <p className="text-sm text-gray-600">
                    Catat suhu tubuh setiap pagi untuk mendeteksi ovulasi lebih
                    akurat.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    Tingkatkan Asupan Air
                  </h4>
                  <p className="text-sm text-gray-600">
                    Minum 8 gelas air per hari untuk membantu mengurangi gejala
                    PMS.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-2 border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-200">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    Olahraga Teratur
                  </h4>
                  <p className="text-sm text-gray-600">
                    30 menit olahraga ringan dapat membantu mengurangi kram dan
                    mood swings.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-2 border-pink-100 hover:border-pink-200 hover:shadow-md transition-all duration-200">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Kelola Stres</h4>
                  <p className="text-sm text-gray-600">
                    Meditasi atau yoga dapat membantu mengelola stres yang
                    mempengaruhi siklus.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            asChild
            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 px-8 py-6 text-base"
          >
            <Link href="/calender">
              <Calendar className="h-5 w-5 mr-2" />
              Lihat Kalender
            </Link>
          </Button>
          <Button
            asChild
            className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 px-8 py-6 text-base"
          >
            <Link href="/log">
              <Activity className="h-5 w-5 mr-2" />
              Tambah Data
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
