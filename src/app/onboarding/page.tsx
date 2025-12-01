'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  Activity, 
  Heart, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface OnboardingData {
  // Step 1: Personal Info
  birthDate: string;
  menstrualStatus: string;
  
  // Step 2: Last Period Info
  lastPeriodDate: string;
  periodDuration: string;
  cycleLength: string;
  
  // Step 3: Symptoms
  commonSymptoms: string[];
  severity: string;
  
  // Step 4: Lifestyle
  exerciseFrequency: string;
  stressLevel: string;
  sleepQuality: string;
  diet: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    birthDate: '',
    menstrualStatus: '',
    lastPeriodDate: '',
    periodDuration: '',
    cycleLength: '',
    commonSymptoms: [],
    severity: '',
    exerciseFrequency: '',
    stressLevel: '',
    sleepQuality: '',
    diet: ''
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user is already onboarded
    if (user?.isOnboarded) {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, router, user]);

  const handleInputChange = (field: string, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (symptom: string, checked: boolean) => {
    setOnboardingData(prev => ({
      ...prev,
      commonSymptoms: checked 
        ? [...prev.commonSymptoms, symptom]
        : prev.commonSymptoms.filter(s => s !== symptom)
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.birthDate && onboardingData.menstrualStatus;
      case 2:
        return onboardingData.lastPeriodDate && onboardingData.periodDuration && onboardingData.cycleLength;
      case 3:
        return onboardingData.commonSymptoms.length > 0 && onboardingData.severity;
      case 4:
        return onboardingData.exerciseFrequency && onboardingData.stressLevel && onboardingData.sleepQuality && onboardingData.diet;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...onboardingData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user in store
        if (user) {
          useAuthStore.getState().setUser({
            ...user,
            isOnboarded: true,
            birthDate: new Date(onboardingData.birthDate),
            menstrualStatus: onboardingData.menstrualStatus,
            lastPeriodDate: new Date(onboardingData.lastPeriodDate),
            avgPeriodLength: parseInt(onboardingData.periodDuration),
            avgCycleLength: parseInt(onboardingData.cycleLength)
          });
        }
        
        router.push('/dashboard');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data onboarding');
    } finally {
      setIsSaving(false);
    }
  };

  const symptoms = [
    'Nyeri perut/kram',
    'Sakit punggung',
    'Sakit kepala',
    'Payudara nyeri/bengkak',
    'Jerawatan',
    'Lelah/mudah capek',
    'Perubahan mood',
    'Nafsu makan berubah',
    'Bloating/perut kembung',
    'Insomnia/sulit tidur'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Informasi Pribadi</h3>
              <p className="text-gray-600">Mari kami kenali lebih baik untuk memberikan analisis yang tepat</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={onboardingData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>Status Menstruasi *</Label>
                <RadioGroup 
                  value={onboardingData.menstrualStatus} 
                  onValueChange={(value) => handleInputChange('menstrualStatus', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Teratur (setiap bulan)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="irregular" id="irregular" />
                    <Label htmlFor="irregular">Tidak teratur</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pms" id="pms" />
                    <Label htmlFor="pms">Sering PMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">Belum menstruasi</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Informasi Siklus</h3>
              <p className="text-gray-600">Data ini penting untuk prediksi yang akurat</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastPeriodDate">Tanggal Hari Pertama Haid Terakhir *</Label>
                <Input
                  id="lastPeriodDate"
                  type="date"
                  value={onboardingData.lastPeriodDate}
                  onChange={(e) => handleInputChange('lastPeriodDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodDuration">Durasi Haid (hari) *</Label>
                  <Select value={onboardingData.periodDuration} onValueChange={(value) => handleInputChange('periodDuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day} hari
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cycleLength">Panjang Siklus (hari) *</Label>
                  <Select value={onboardingData.cycleLength} onValueChange={(value) => handleInputChange('cycleLength', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 35 }, (_, i) => i + 21).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day} hari
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Panjang siklus dihitung dari hari pertama haid saat ini hingga hari pertama haid berikutnya.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gejala yang Sering Muncul</h3>
              <p className="text-gray-600">Pilih gejala yang biasa Anda alami</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={onboardingData.commonSymptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleSymptomToggle(symptom, checked as boolean)}
                    />
                    <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Tingkat Keparahan Gejala *</Label>
                <RadioGroup 
                  value={onboardingData.severity} 
                  onValueChange={(value) => handleInputChange('severity', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">Ringka - Tidak mengganggu aktivitas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Sedang - Sedikit mengganggu aktivitas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">Berat - Sangat mengganggu aktivitas</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gaya Hidup</h3>
              <p className="text-gray-600">Informasi gaya hidup membantu analisis lebih akurat</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">Frekuensi Olahraga *</Label>
                <Select value={onboardingData.exerciseFrequency} onValueChange={(value) => handleInputChange('exerciseFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Tidak pernah</SelectItem>
                    <SelectItem value="rarely">Jarang (1-2x/minggu)</SelectItem>
                    <SelectItem value="sometimes">Kadang (3-4x/minggu)</SelectItem>
                    <SelectItem value="often">Sering (5-6x/minggu)</SelectItem>
                    <SelectItem value="daily">Setiap hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stressLevel">Tingkat Stres *</Label>
                <Select value={onboardingData.stressLevel} onValueChange={(value) => handleInputChange('stressLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah - Santai</SelectItem>
                    <SelectItem value="moderate">Sedang - Normal</SelectItem>
                    <SelectItem value="high">Tinggi - Sering stres</SelectItem>
                    <SelectItem value="very_high">Sangat tinggi - Stres berat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleepQuality">Kualitas Tidur *</Label>
                <Select value={onboardingData.sleepQuality} onValueChange={(value) => handleInputChange('sleepQuality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Sangat baik (7-9 jam)</SelectItem>
                    <SelectItem value="good">Baik (6-7 jam)</SelectItem>
                    <SelectItem value="fair">Cukup (5-6 jam)</SelectItem>
                    <SelectItem value="poor">Buruk (&lt;5 jam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diet">Pola Makan *</Label>
                <Select value={onboardingData.diet} onValueChange={(value) => handleInputChange('diet', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Seimbang - Sayur, protein, karbohidrat</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="irregular">Tidak teratur</SelectItem>
                    <SelectItem value="fast_food">Sering makan junk food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Langkah {currentStep} dari {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {currentStep === 1 && 'Selamat Datang di Red Calendar! 🌸'}
                {currentStep === 2 && 'Data Siklus Menstruasi'}
                {currentStep === 3 && 'Gejala PMS'}
                {currentStep === 4 && 'Gaya Hidup & Kesehatan'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Sebelumnya
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep() || isSaving}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {isSaving ? 'Menyimpan...' : 'Selesai Onboarding'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Selanjutnya
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Mengapa Data Ini Penting?</h4>
                <p className="text-sm text-blue-800">
                  Data yang Anda berikan akan membantu kami memberikan analisis siklus yang lebih akurat, 
                  prediksi yang lebih tepat, dan saran kesehatan yang personal sesuai kondisi Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}