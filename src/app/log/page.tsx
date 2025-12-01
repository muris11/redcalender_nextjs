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
import { Badge } from '@/components/ui/badge';
import { Calendar, Home, Save, Heart, Activity, Droplets, Moon } from 'lucide-react';
import Link from 'next/link';

export default function LogPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    // Physical measurements
    weight: '',
    temperature: '',
    waterIntake: '',
    sleepHours: '',
    
    // Sexual & reproductive health
    sexualActivity: '',
    libido: '',
    orgasm: false,
    cervixMucus: '',
    cervixPosition: '',
    ovulationTestResult: '',
    pregnancyTestResult: '',
    sadariResult: '',
    
    // Notes
    notes: '',
    
    // Arrays for multi-select
    symptoms: [] as string[],
    moods: [] as string[]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  const symptoms = [
    { id: 'back_pain', name: 'Sakit punggung', category: 'pain' },
    { id: 'headache', name: 'Sakit kepala', category: 'pain' },
    { id: 'cramps', name: 'Kram otot', category: 'pain' },
    { id: 'pelvic_pain', name: 'Nyeri panggul', category: 'pain' },
    { id: 'breast_tenderness', name: 'Sensitif payudara', category: 'pain' },
    { id: 'acne', name: 'Jerawatan', category: 'skin' },
    { id: 'fatigue', name: 'Kelelahan', category: 'physical' },
    { id: 'spotting', name: 'Bercak darah', category: 'physical' }
  ];

  const moods = [
    { id: 'happy', name: 'Riang', icon: '😊' },
    { id: 'in_love', name: 'Jatuh cinta', icon: '🥰' },
    { id: 'angry', name: 'Pemarah', icon: '😠' },
    { id: 'tired', name: 'Lelah', icon: '😴' },
    { id: 'sad', name: 'Berduka', icon: '😢' },
    { id: 'depressed', name: 'Depresi', icon: '😔' },
    { id: 'emotional', name: 'Emosional', icon: '😭' },
    { id: 'anxious', name: 'Cemas', icon: '😰' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveMessage('');
  };

  const handleSymptomToggle = (symptomName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptomName]
        : prev.symptoms.filter(s => s !== symptomName)
    }));
    setSaveMessage('');
  };

  const handleMoodToggle = (moodName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      moods: checked 
        ? [...prev.moods, moodName]
        : prev.moods.filter(m => m !== moodName)
    }));
    setSaveMessage('');
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          date: selectedDate,
          weight: formData.weight || null,
          temperature: formData.temperature || null,
          waterIntake: formData.waterIntake || null,
          sleepHours: formData.sleepHours || null,
          sexualActivity: formData.sexualActivity || null,
          libido: formData.libido || null,
          orgasm: formData.orgasm || null,
          cervixMucus: formData.cervixMucus || null,
          cervixPosition: formData.cervixPosition || null,
          ovulationTestResult: formData.ovulationTestResult || null,
          pregnancyTestResult: formData.pregnancyTestResult || null,
          sadariResult: formData.sadariResult || null,
          notes: formData.notes || null,
          symptoms: formData.symptoms,
          moods: formData.moods
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveMessage('Data berhasil disimpan! ✅');
      } else {
        setSaveMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setSaveMessage('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
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
              <Link href="/calendar">
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Kalender
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Catat Gejala</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hai, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Pilih Tanggal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </CardContent>
        </Card>

        {/* Physical Measurements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Pengukuran Fisik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Berat Badan (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="55.5"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Suhu Tubuh (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waterIntake">Asupan Air (ml)</Label>
                <Input
                  id="waterIntake"
                  type="number"
                  placeholder="2000"
                  value={formData.waterIntake}
                  onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Durasi Tidur (jam)</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  placeholder="8"
                  value={formData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gejala Fisik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom.id}
                    checked={formData.symptoms.includes(symptom.name)}
                    onCheckedChange={(checked) => handleSymptomToggle(symptom.name, checked as boolean)}
                  />
                  <Label htmlFor={symptom.id} className="text-sm">
                    {symptom.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Moods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Suasana Hati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <div key={mood.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={mood.id}
                    checked={formData.moods.includes(mood.name)}
                    onCheckedChange={(checked) => handleMoodToggle(mood.name, checked as boolean)}
                  />
                  <Label htmlFor={mood.id} className="text-sm">
                    {mood.icon} {mood.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sexual & Reproductive Health */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kesehatan Seksual & Reproduksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Aktivitas Seksual</Label>
                <Select value={formData.sexualActivity} onValueChange={(value) => handleInputChange('sexualActivity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada</SelectItem>
                    <SelectItem value="unprotected">Seks tanpa perlindungan</SelectItem>
                    <SelectItem value="protected">Seks terlindungi</SelectItem>
                    <SelectItem value="masturbation">Masturbasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Libido</Label>
                <Select value={formData.libido} onValueChange={(value) => handleInputChange('libido', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Mukus Serviks</Label>
                <Select value={formData.cervixMucus} onValueChange={(value) => handleInputChange('cervixMucus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Kering</SelectItem>
                    <SelectItem value="sticky">Lengket</SelectItem>
                    <SelectItem value="creamy">Seperti Krim</SelectItem>
                    <SelectItem value="watery">Encer</SelectItem>
                    <SelectItem value="egg_white">Putih Telur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Posisi Serviks</Label>
                <Select value={formData.cervixPosition} onValueChange={(value) => handleInputChange('cervixPosition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tes Ovulasi</Label>
                <Select value={formData.ovulationTestResult} onValueChange={(value) => handleInputChange('ovulationTestResult', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="peak">Puncak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tes Kehamilan</Label>
                <Select value={formData.pregnancyTestResult} onValueChange={(value) => handleInputChange('pregnancyTestResult', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positif</SelectItem>
                    <SelectItem value="negative">Negatif</SelectItem>
                    <SelectItem value="faint_line">Garis Samar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SADARI */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SADARI (Periksa Payudara Sendiri)</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.sadariResult} onValueChange={(value) => handleInputChange('sadariResult', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih hasil pemeriksaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="lump">Benjolan</SelectItem>
                <SelectItem value="pain">Nyeri</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Catatan Pribadi</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tulis catatan apa pun tentang perasaan, gejala, atau peristiwa penting hari ini..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ringkasan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Gejala: </span>
                  {formData.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              )}
              
              {formData.moods.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Mood: </span>
                  {formData.moods.map((mood, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1">
                      {mood}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-between items-center">
          <div>
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </span>
            )}
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </div>
      </main>
    </div>
  );
}