"use client";

import { Navbar } from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Analisis Kesehatan
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg xl:text-xl max-w-2xl mx-auto px-2">
            Pantau tren siklus dan kesehatan Anda
          </p>
        </div>

        {(isAbnormal || isVariationHigh) && (
          <Alert className="mb-6 sm:mb-8 lg:mb-10 bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-lg rounded-xl">
            <AlertDescription className="text-orange-900 text-sm sm:text-base leading-relaxed">
              <strong className="font-bold">⚠️ Perhatian:</strong>{" "}
              <span className="block sm:inline mt-1 sm:mt-0">
                {isVariationHigh
                  ? "Siklus Anda fluktuatif melebihi variasi tipikal. Penting untuk tetap waspada. Jika Anda merasa khawatir, jangan ragu untuk berbicara dengan penyedia perawatan kesehatan."
                  : "Rata-rata siklus Anda berada di luar rentang normal (21-35 hari). Disarankan untuk berkonsultasi dengan dokter."}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white/90 backdrop-blur-sm">
            <div className="h-1.5 sm:h-2 bg-linear-to-r from-blue-400 to-blue-600"></div>
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base">Rata-rata Siklus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {avgCycleLength} hari
                </span>
                {isAbnormal && (
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 shrink-0" />
                )}
              </div>
              <p
                className={`text-xs sm:text-sm font-medium ${
                  isAbnormal ? "text-orange-600" : "text-green-600"
                }`}
              >
                {isAbnormal
                  ? "Di luar rentang normal"
                  : "Normal (21-35 hari)"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white/90 backdrop-blur-sm">
            <div className="h-1.5 sm:h-2 bg-linear-to-r from-red-400 to-red-600"></div>
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-100 flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <span className="text-sm sm:text-base">Rata-rata Haid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                {avgPeriodLength} hari
              </div>
              <p className="text-xs sm:text-sm font-medium text-green-600">
                Normal (3-7 hari)
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white/90 backdrop-blur-sm">
            <div className="h-1.5 sm:h-2 bg-linear-to-r from-green-400 to-green-600"></div>
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <span className="text-sm sm:text-base">Variasi Siklus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                {Math.max(...cycleData.map((c) => c.cycleLength)) -
                  Math.min(...cycleData.map((c) => c.cycleLength))}{" "}
                hari
              </div>
              <p
                className={`text-xs sm:text-sm font-medium ${
                  isVariationHigh ? "text-orange-600" : "text-green-600"
                }`}
              >
                {isVariationHigh ? "Variasi tinggi" : "Variasi normal"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white/90 backdrop-blur-sm">
            <div className="h-1.5 sm:h-2 bg-linear-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center text-base sm:text-lg text-gray-800">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <span className="text-sm sm:text-base">Total Siklus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                {cycleData.length}
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                6 bulan terakhir
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* Cycle Length Trend */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-r from-pink-50 to-rose-50 border-b border-pink-100 p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl text-pink-900 flex items-center">
                <span className="text-xl sm:text-2xl mr-2">📈</span>
                <span className="text-sm sm:text-base lg:text-lg">Tren Panjang Siklus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={280} className="text-xs sm:text-sm">
                <LineChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    domain={[20, 40]}
                    stroke="#6b7280"
                    fontSize={12}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #ec4899",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="cycleLength"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="Panjang Siklus (hari)"
                    dot={{ fill: "#ec4899", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={avgCycleLength}
                    stroke="#9ca3af"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    name="Rata-rata"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Period Length Trend */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-r from-red-50 to-pink-50 border-b border-red-100 p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl text-red-900 flex items-center">
                <span className="text-xl sm:text-2xl mr-2">📊</span>
                <span className="text-sm sm:text-base lg:text-lg">Tren Durasi Haid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={280} className="text-xs sm:text-sm">
                <BarChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#6b7280"
                    fontSize={12}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #ef4444",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="periodLength"
                    fill="#ef4444"
                    name="Durasi Haid (hari)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Symptom and Mood Analysis */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-gray-800 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">💭</span>
                <span className="text-sm sm:text-base lg:text-lg">Analisis Gejala dan Suasana Hati</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {/* Mood Analysis */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-purple-900 flex items-center justify-center sm:justify-start">
                    <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 sm:mr-3 shrink-0 text-sm sm:text-base">
                      💜
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg">Suasana Hati</span>
                  </h3>
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    {moodData.slice(0, 5).map((mood, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate mr-2">
                            {mood.name}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-purple-600 shrink-0">
                            {mood.count}
                          </span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2 sm:h-3">
                          <div
                            className="bg-linear-to-r from-purple-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-sm"
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
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-red-900 flex items-center justify-center sm:justify-start">
                    <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-red-100 flex items-center justify-center mr-2 sm:mr-3 shrink-0 text-sm sm:text-base">
                      🩺
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg">Gejala Fisik</span>
                  </h3>
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    {symptomData.slice(0, 5).map((symptom, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl border border-red-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate mr-2">
                            {symptom.name}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-red-600 shrink-0">
                            {symptom.count}
                          </span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2 sm:h-3">
                          <div
                            className="bg-linear-to-r from-red-500 to-red-600 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-sm"
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
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-r from-green-50 to-teal-50 border-b border-green-100 p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-gray-800 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">💡</span>
                <span className="text-sm sm:text-base lg:text-lg">Rekomendasi Kesehatan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Pantau Suhu Basal Tubuh
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Catat suhu tubuh setiap pagi untuk mendeteksi ovulasi lebih
                      akurat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Tingkatkan Asupan Air
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Minum 8 gelas air per hari untuk membantu mengurangi gejala
                      PMS.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Olahraga Teratur
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      30 menit olahraga ringan dapat membantu mengurangi kram dan
                      mood swings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-pink-100 hover:border-pink-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Kelola Stres</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Meditasi atau yoga dapat membantu mengelola stres yang
                      mempengaruhi siklus.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
