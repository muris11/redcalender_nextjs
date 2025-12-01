'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Heart, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Home,
  Activity,
  Droplets,
  Moon
} from 'lucide-react';

interface ReportData {
  user: {
    name: string;
    avgCycleLength: number;
    avgPeriodLength: number;
    menstrualStatus: string;
    lastPeriodDate: string;
  };
  analysis: {
    currentPhase: string;
    cycleDay: number;
    daysUntilNextPeriod: number;
    fertileWindow: {
      start: number;
      end: number;
      isActive: boolean;
    };
    ovulationDay: number;
    cycleRegularity: string;
    variation: number;
    avgCycleLength: number;
    avgPeriodLength: number;
    symptomFrequency: Array<{ name: string; count: number }>;
    moodFrequency: Array<{ name: string; count: number }>;
    recommendations: Array<{
      type: string;
      title: string;
      description: string;
      priority: string;
    }>;
    healthAlerts: Array<{
      type: string;
      title: string;
      message: string;
      severity: string;
    }>;
  };
  cycles: Array<{
    id: string;
    startDate: string;
    endDate: string;
    isAbnormal: boolean;
  }>;
}

export default function ReportPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user is onboarded
    if (!user?.isOnboarded) {
      router.push('/onboarding');
      return;
    }

    loadReportData();
  }, [isAuthenticated, router, user]);

  const loadReportData = async () => {
    try {
      const response = await fetch(`/api/analysis?userId=${user?.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setReportData(data);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Laporan PDF akan segera tersedia untuk diunduh!');
    } catch (error) {
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return '#ef4444';
      case 'follicular': return '#10b981';
      case 'ovulation': return '#8b5cf6';
      case 'luteal': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPhaseName = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'Menstruasi';
      case 'follicular': return 'Folikuler';
      case 'ovulation': return 'Ovulasi';
      case 'luteal': return 'Luteal';
      default: return 'Tidak Diketahui';
    }
  };

  const getRegularityStatus = (regularity: string) => {
    switch (regularity) {
      case 'regular': return { text: 'Teratur', color: 'bg-green-100 text-green-800', icon: '✅' };
      case 'somewhat_irregular': return { text: 'Cukup Teratur', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' };
      case 'irregular': return { text: 'Tidak Teratur', color: 'bg-red-100 text-red-800', icon: '❌' };
      default: return { text: 'Tidak Diketahui', color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pieColors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  const { user: userData, analysis, cycles } = reportData;
  const regularityStatus = getRegularityStatus(analysis.cycleRegularity);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Laporan Kesehatan</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hai, {userData.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                <SelectItem value="12months">12 Bulan Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generatePDF} 
            disabled={isGenerating}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Membuat PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Unduh Laporan PDF
              </>
            )}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Siklus Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                Hari ke-{analysis.cycleDay}
              </div>
              <Badge className={getPhaseColor(analysis.currentPhase)}>
                {getPhaseName(analysis.currentPhase)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Rata-rata Siklus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {analysis.avgCycleLength} hari
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${regularityStatus.color}`}>
                  {regularityStatus.icon} {regularityStatus.text}
                </span>
              </div>
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
              <div className="text-2xl font-bold mb-1">
                {analysis.avgPeriodLength} hari
              </div>
              <p className="text-sm text-gray-600">Normal (3-7 hari)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Moon className="h-5 w-5 mr-2 text-purple-500" />
                Masa Subur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {analysis.fertileWindow.isActive ? 'Aktif' : 'Tidak Aktif'}
              </div>
              <p className="text-sm text-gray-600">
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
                <Alert key={index} className={
                  alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }>
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
                <LineChart data={cycles.map((cycle, index) => ({
                  month: `Bulan ${index + 1}`,
                  cycleLength: Math.floor((new Date(cycle.startDate).getTime() - new Date(cycles[index + 1]?.startDate || cycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 28
                }))}>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analysis.symptomFrequency.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
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
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{symptom.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-600 h-2 rounded-full" 
                          style={{ width: `${(symptom.count / Math.max(...analysis.symptomFrequency.map(s => s.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{symptom.count}</span>
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
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mood.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(mood.count / Math.max(...analysis.moodFrequency.map(m => m.count))) * 100}%` }}
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
                      {rec.priority === 'high' ? 'Penting' : 
                       rec.priority === 'medium' ? 'Sedang' : 'Ringan'}
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
                      <td className="p-2">{new Date(cycle.startDate).toLocaleDateString('id-ID')}</td>
                      <td className="p-2">{cycle.endDate ? new Date(cycle.endDate).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="p-2">
                        {cycle.endDate ? Math.floor((new Date(cycle.endDate).getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) : '-'} hari
                      </td>
                      <td className="p-2">
                        {cycle.isAbnormal ? (
                          <Badge className="bg-red-100 text-red-800">Abnormal</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">Normal</Badge>
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
        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          <Button asChild>
            <FileText className="h-4 w-4 mr-2" />
            Lihat Analisis Lengkap
          </Button>
        </div>
      </main>
    </div>
  );
}