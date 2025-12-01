'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Home, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Download, 
  Activity,
  Heart,
  Thermometer,
  Droplets
} from 'lucide-react';
import Link from 'next/link';

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

export default function AnalysisPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [symptomData, setSymptomData] = useState<SymptomFrequency[]>([]);
  const [moodData, setMoodData] = useState<MoodFrequency[]>([]);
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [avgPeriodLength, setAvgPeriodLength] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate loading data (nanti akan diambil dari API)
    setTimeout(() => {
      loadAnalysisData();
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const loadAnalysisData = () => {
    // Simulate cycle data for the last 6 months
    const mockCycleData: CycleData[] = [
      { month: 'Jan', cycleLength: 28, periodLength: 5, startDate: '2024-01-15' },
      { month: 'Feb', cycleLength: 30, periodLength: 6, startDate: '2024-02-12' },
      { month: 'Mar', cycleLength: 27, periodLength: 5, startDate: '2024-03-14' },
      { month: 'Apr', cycleLength: 29, periodLength: 7, startDate: '2024-04-10' },
      { month: 'Mei', cycleLength: 31, periodLength: 6, startDate: '2024-05-09' },
      { month: 'Jun', cycleLength: 28, periodLength: 5, startDate: '2024-06-09' }
    ];

    const mockSymptomData: SymptomFrequency[] = [
      { name: 'Sakit punggung', count: 15, category: 'pain' },
      { name: 'Kelelahan', count: 12, category: 'physical' },
      { name: 'Sensitif payudara', count: 10, category: 'pain' },
      { name: 'Jerawatan', count: 8, category: 'skin' },
      { name: 'Sakit kepala', count: 7, category: 'pain' },
      { name: 'Kram otot', count: 6, category: 'pain' }
    ];

    const mockMoodData: MoodFrequency[] = [
      { name: 'Lelah', count: 18 },
      { name: 'Cemas', count: 12 },
      { name: 'Emosional', count: 10 },
      { name: 'Riang', count: 8 },
      { name: 'Pemarah', count: 5 }
    ];

    setCycleData(mockCycleData);
    setSymptomData(mockSymptomData);
    setMoodData(mockMoodData);

    // Calculate averages
    const avgCycle = Math.round(
      mockCycleData.reduce((sum, cycle) => sum + cycle.cycleLength, 0) / mockCycleData.length
    );
    const avgPeriod = Math.round(
      mockCycleData.reduce((sum, cycle) => sum + cycle.periodLength, 0) / mockCycleData.length
    );

    setAvgCycleLength(avgCycle);
    setAvgPeriodLength(avgPeriod);
  };

  const isAbnormal = avgCycleLength > 35 || avgCycleLength < 21;
  const isVariationHigh = Math.max(...cycleData.map(c => c.cycleLength)) - Math.min(...cycleData.map(c => c.cycleLength)) > 9;

  const exportPDF = () => {
    // Simulate PDF export
    alert('Fitur export PDF akan segera tersedia. Data Anda akan disimpan dalam format PDF untuk dokter.');
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data analisis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Analisis Siklus</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={exportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <span className="text-sm text-gray-600">Hai, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medical Alert */}
        {(isAbnormal || isVariationHigh) && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Perhatian:</strong> {isVariationHigh 
                ? "Siklus Anda fluktuatif melebihi variasi tipikal. Penting untuk tetap waspada. Jika Anda merasa khawatir, jangan ragu untuk berbicara dengan penyedia perawatan kesehatan."
                : "Rata-rata siklus Anda berada di luar rentang normal (21-35 hari). Disarankan untuk berkonsultasi dengan dokter."
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Rata-rata Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{avgCycleLength} hari</span>
                {isAbnormal && <AlertTriangle className="h-5 w-5 text-orange-500" />}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isAbnormal ? "Di luar rentang normal" : "Normal (21-35 hari)"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Activity className="h-5 w-5 mr-2 text-red-500" />
                Rata-rata Haid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPeriodLength} hari</div>
              <p className="text-sm text-gray-600 mt-1">Normal (3-7 hari)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Variasi Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...cycleData.map(c => c.cycleLength)) - Math.min(...cycleData.map(c => c.cycleLength))} hari
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isVariationHigh ? "Variasi tinggi" : "Variasi normal"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Heart className="h-5 w-5 mr-2 text-purple-500" />
                Total Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cycleData.length}</div>
              <p className="text-sm text-gray-600 mt-1">6 bulan terakhir</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cycle Length Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Panjang Siklus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cycleData}>
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
                  <Line 
                    type="monotone" 
                    dataKey={avgCycleLength} 
                    stroke="#6b7280" 
                    strokeDasharray="5 5"
                    name="Rata-rata"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Period Length Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Durasi Haid</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="periodLength" 
                    fill="#ef4444"
                    name="Durasi Haid (hari)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Symptom and Mood Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Common Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Gejala Paling Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {symptomData.slice(0, 5).map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{symptom.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {symptom.category === 'pain' ? 'Nyeri' : 
                         symptom.category === 'physical' ? 'Fisik' : 'Kulit'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-600 h-2 rounded-full" 
                          style={{ width: `${(symptom.count / Math.max(...symptomData.map(s => s.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{symptom.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Common Moods */}
          <Card>
            <CardHeader>
              <CardTitle>Suasana Hati Paling Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodData.slice(0, 5).map((mood, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mood.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(mood.count / Math.max(...moodData.map(m => m.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{mood.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Kesehatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Thermometer className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-medium">Pantau Suhu Basal Tubuh</h4>
                  <p className="text-sm text-gray-600">
                    Catat suhu tubuh setiap pagi untuk mendeteksi ovulasi lebih akurat.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Droplets className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium">Tingkatkan Asupan Air</h4>
                  <p className="text-sm text-gray-600">
                    Minum 8 gelas air per hari untuk membantu mengurangi gejala PMS.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium">Olahraga Teratur</h4>
                  <p className="text-sm text-gray-600">
                    30 menit olahraga ringan dapat membantu mengurangi kram dan mood swings.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="h-5 w-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-medium">Kelola Stres</h4>
                  <p className="text-sm text-gray-600">
                    Meditasi atau yoga dapat membantu mengelola stres yang mempengaruhi siklus.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild>
            <Link href="/calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Lihat Kalender
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/log">
              <Activity className="h-4 w-4 mr-2" />
              Tambah Data
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}