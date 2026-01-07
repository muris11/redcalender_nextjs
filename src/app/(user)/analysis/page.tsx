"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useAuthStore } from "@/store/authStore";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Droplets,
  Heart,
  Thermometer,
  TrendingUp,
  BarChart3,
  Brain,
  Lightbulb,
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
  const [hasInsufficientData, setHasInsufficientData] = useState(false);

  useEffect(() => {
    // Set page title
    // document.title = "Analisis Kesehatan - Red Calendar"; // Handled by metadata

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
      const transformedCycleData = transformCycleData(data.cycles, data.analysis.avgCycleLength);
      const transformedSymptomData = transformSymptomData(
        data.analysis.symptomFrequency
      );
      const transformedMoodData = data.analysis.moodFrequency;

      // Debug logging
      console.log('🔍 Raw cycles from API:', data.cycles);
      console.log('📊 Transformed cycle data for chart:', transformedCycleData);
      console.log('📈 avgCycleLength:', data.analysis.avgCycleLength);

      // Check if we have sufficient data for meaningful charts
      setHasInsufficientData(data.cycles.length < 2);

      setCycleData(transformedCycleData);
      setSymptomData(transformedSymptomData);
      setMoodData(transformedMoodData);
      setAvgCycleLength(data.analysis.avgCycleLength || 28);
      setAvgPeriodLength(data.analysis.avgPeriodLength || 6);
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

  const transformCycleData = (cycles: any[], userAvgCycleLength: number = 28): CycleData[] => {
    if (!cycles || cycles.length === 0) return [];
    
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

    // Cycles come sorted desc from API (newest first), we need to reverse for chart (oldest first)
    const sortedCycles = [...cycles].slice(0, 6).reverse();
    
    return sortedCycles.map((cycle, index) => {
      const date = new Date(cycle.startDate);
      const month = monthNames[date.getMonth()];

      // Calculate cycle length (difference to next cycle start)
      let cycleLength = userAvgCycleLength; // default to user's average
      if (index < sortedCycles.length - 1) {
        const nextCycle = sortedCycles[index + 1];
        const days = Math.floor(
          (new Date(nextCycle.startDate).getTime() - date.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        // Only use calculated value if it's reasonable (between 15-60 days)
        if (days > 0 && days < 60) cycleLength = days;
      }

      // Calculate period length from start to end date
      let periodLength = 6; // default
      if (cycle.startDate && cycle.endDate) {
        const periodDays = Math.floor(
          (new Date(cycle.endDate).getTime() - date.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        // Sanity check: period should be between 1-14 days
        if (periodDays > 0 && periodDays <= 14) periodLength = periodDays;
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

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12">
        <ChartSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <Heading level="1" size="heading-xl" className="mb-2">
          Analisis Kesehatan
        </Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Pantau tren siklus dan kesehatan Anda
        </Text>
      </div>

        {(isAbnormal || isVariationHigh) && (
          <Alert className="mb-6 bg-orange-50 border-l-4 border-orange-500">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm text-orange-900 leading-relaxed">
              {isVariationHigh
                ? "Siklus Anda fluktuatif melebihi variasi tipikal. Disarankan berkonsultasi dengan dokter."
                : "Rata-rata siklus Anda berada di luar rentang normal (21-35 hari). Disarankan berkonsultasi dengan dokter."}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <Text variant="display-sm" className="font-bold text-primary mb-1">
                {avgCycleLength}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Rata-rata Siklus
              </Text>
              <Text
                variant="label-xs"
                className={isAbnormal ? "text-orange-600" : "text-green-600"}
              >
                {isAbnormal ? "Abnormal" : "Normal"}
              </Text>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <Text variant="display-sm" className="font-bold text-red-600 mb-1">
                {avgPeriodLength}
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
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <Text variant="display-sm" className="font-bold text-green-600 mb-1">
                {Math.max(...cycleData.map((c) => c.cycleLength)) -
                  Math.min(...cycleData.map((c) => c.cycleLength))}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Variasi Siklus
              </Text>
              <Text
                variant="label-xs"
                className={isVariationHigh ? "text-orange-600" : "text-green-600"}
              >
                {isVariationHigh ? "Tinggi" : "Normal"}
              </Text>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <Text variant="display-sm" className="font-bold text-purple-600 mb-1">
                {cycleData.length}
              </Text>
              <Text variant="body-xs" className="text-muted-foreground mb-1">
                Total Siklus
              </Text>
              <Text variant="label-xs" className="text-muted-foreground">
                6 bulan terakhir
              </Text>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Cycle Length Trend */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Tren Panjang Siklus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {hasInsufficientData || cycleData.length < 2 ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-gray-500">
                  <Calendar className="h-12 w-12 mb-4 text-pink-300" />
                  <p className="text-center text-sm sm:text-base font-medium">
                    Belum ada data yang cukup
                  </p>
                  <p className="text-center text-xs sm:text-sm text-gray-400 mt-1">
                    Minimal 2 siklus diperlukan untuk menampilkan tren
                  </p>
                </div>
              ) : (
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
                      domain={['auto', 'auto']}
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
                      formatter={(value: number) => [`${value} hari`, "Panjang Siklus"]}
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
                  </LineChart>
                </ResponsiveContainer>
              )}
              {cycleData.length >= 2 && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Rata-rata: <span className="font-semibold text-theme">{avgCycleLength} hari</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Period Length Trend */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-5 w-5 text-red-600" />
                <span>Tren Durasi Haid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {hasInsufficientData || cycleData.length < 2 ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-gray-500">
                  <Activity className="h-12 w-12 mb-4 text-red-300" />
                  <p className="text-center text-sm sm:text-base font-medium">
                    Belum ada data yang cukup
                  </p>
                  <p className="text-center text-xs sm:text-sm text-gray-400 mt-1">
                    Minimal 2 siklus diperlukan untuk menampilkan tren
                  </p>
                </div>
              ) : (
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
                      formatter={(value: number) => [`${value} hari`, "Durasi Haid"]}
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
              )}
              {cycleData.length >= 2 && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Rata-rata: <span className="font-semibold text-red-600">{avgPeriodLength} hari</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Symptom and Mood Analysis */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Analisis Gejala dan Suasana Hati</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mood Analysis */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-purple-600" />
                    </div>
                    <Text variant="body-lg" className="font-bold">Suasana Hati</Text>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {moodData.slice(0, 5).map((mood, index) => (
                      <div
                        key={index}
                        className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate mr-2">
                            {mood.name}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-purple-600 shrink-0">
                            {mood.count}
                          </span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-3">
                          <div
                            className="bg-purple-600 h-3 rounded-full transition-all"
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
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-red-600" />
                    </div>
                    <Text variant="body-lg" className="font-bold">Gejala Fisik</Text>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {symptomData.slice(0, 5).map((symptom, index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-50 rounded-lg border border-red-100 hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate mr-2">
                            {symptom.name}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-red-600 shrink-0">
                            {symptom.count}
                          </span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-3">
                          <div
                            className="bg-red-600 h-3 rounded-full transition-all"
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
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <span>Rekomendasi Kesehatan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
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

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
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

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
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

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-pink-100 hover:border-pink-200 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-theme" />
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
  );
}
