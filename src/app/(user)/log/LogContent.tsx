"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { Activity, Calendar, Heart, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Physical measurements
    weight: "",
    temperature: "",
    waterIntake: "",
    sleepHours: "",

    // Sexual & reproductive health
    sexualActivity: "",
    libido: "",
    orgasm: false,
    cervixMucus: "",
    cervixPosition: "",
    ovulationTestResult: "",
    pregnancyTestResult: "",
    sadariResult: "",

    // Notes
    notes: "",

    // Arrays for multi-select
    symptoms: [] as string[],
    moods: [] as string[],
  });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const loadExistingData = async (date: string) => {
    if (!user?.id) return;

    setIsDataLoading(true);
    try {
      const response = await fetch(
        `/api/user/daily-logs?userId=${user.id}&date=${date}`
      );
      const data = await response.json();

      if (response.ok && data.dailyLogs && data.dailyLogs.length > 0) {
        const log = data.dailyLogs[0];
        setFormData({
          weight: log.weight?.toString() || "",
          temperature: log.temperature?.toString() || "",
          waterIntake: log.waterIntake?.toString() || "",
          sleepHours: log.sleepHours?.toString() || "",
          sexualActivity: log.sexualActivity || "",
          libido: log.libido || "",
          orgasm: log.orgasm || false,
          cervixMucus: log.cervixMucus || "",
          cervixPosition: log.cervixPosition || "",
          ovulationTestResult: log.ovulationTestResult || "",
          pregnancyTestResult: log.pregnancyTestResult || "",
          sadariResult: log.sadariResult || "",
          notes: log.notes || "",
          symptoms: log.logSymptoms?.map((ls: any) => ls.symptom.name) || [],
          moods: log.logMoods?.map((lm: any) => lm.mood.name) || [],
        });
      } else {
        // Reset form for new date
        setFormData({
          weight: "",
          temperature: "",
          waterIntake: "",
          sleepHours: "",
          sexualActivity: "",
          libido: "",
          orgasm: false,
          cervixMucus: "",
          cervixPosition: "",
          ovulationTestResult: "",
          pregnancyTestResult: "",
          sadariResult: "",
          notes: "",
          symptoms: [],
          moods: [],
        });
      }
    } catch (error) {
      console.error("Error loading existing data:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadExistingData(selectedDate);
  }, [selectedDate, user?.id]);

  const symptoms = [
    { id: "back_pain", name: "Sakit punggung", category: "pain" },
    { id: "headache", name: "Sakit kepala", category: "pain" },
    { id: "cramps", name: "Kram otot", category: "pain" },
    { id: "pelvic_pain", name: "Nyeri panggul", category: "pain" },
    { id: "breast_tenderness", name: "Sensitif payudara", category: "pain" },
    { id: "acne", name: "Jerawatan", category: "skin" },
    { id: "fatigue", name: "Kelelahan", category: "physical" },
    { id: "spotting", name: "Bercak darah", category: "physical" },
  ];

  const moods = [
    { id: "happy", name: "Riang", icon: "😊" },
    { id: "in_love", name: "Jatuh cinta", icon: "🥰" },
    { id: "angry", name: "Pemarah", icon: "😠" },
    { id: "tired", name: "Lelah", icon: "😴" },
    { id: "sad", name: "Berduka", icon: "😢" },
    { id: "depressed", name: "Depresi", icon: "😔" },
    { id: "emotional", name: "Emosional", icon: "😭" },
    { id: "anxious", name: "Cemas", icon: "😰" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const handleSymptomToggle = (symptomName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptomName]
        : prev.symptoms.filter((s) => s !== symptomName),
    }));
    setSaveMessage("");
  };

  const handleMoodToggle = (moodName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      moods: checked
        ? [...prev.moods, moodName]
        : prev.moods.filter((m) => m !== moodName),
    }));
    setSaveMessage("");
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/user/daily-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          moods: formData.moods,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveMessage("Data berhasil disimpan! ✅");
        // Reload data after successful save
        await loadExistingData(selectedDate);
      } else {
        setSaveMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setSaveMessage("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Log Harian Kesehatan
          </h1>
          <p className="text-gray-600 text-lg">
            Catat aktivitas dan kondisi kesehatan Anda setiap hari
          </p>
        </div>

        {/* Date Selection */}
        <Card className="mb-8 border-0 shadow-lg">
          <div className="bg-linear-to-r from-rose-500 to-pink-500 p-6">
            <CardTitle className="flex items-center text-white text-xl">
              <Calendar className="h-6 w-6 mr-3" />
              Pilih Tanggal
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="text-lg h-12 border-2 border-gray-200 focus:border-pink-400"
            />
          </CardContent>
        </Card>

        {/* Physical Measurements */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="flex items-center text-xl text-blue-900">
              <Activity className="h-6 w-6 mr-3 text-blue-600" />
              Pengukuran Fisik
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="weight"
                  className="text-base font-semibold text-gray-700"
                >
                  Berat Badan (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="55.5"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="temperature"
                  className="text-base font-semibold text-gray-700"
                >
                  Suhu Tubuh (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={formData.temperature}
                  onChange={(e) =>
                    handleInputChange("temperature", e.target.value)
                  }
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="waterIntake"
                  className="text-base font-semibold text-gray-700"
                >
                  Asupan Air (ml)
                </Label>
                <Input
                  id="waterIntake"
                  type="number"
                  placeholder="2000"
                  value={formData.waterIntake}
                  onChange={(e) =>
                    handleInputChange("waterIntake", e.target.value)
                  }
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="sleepHours"
                  className="text-base font-semibold text-gray-700"
                >
                  Durasi Tidur (jam)
                </Label>
                <Input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  placeholder="8"
                  value={formData.sleepHours}
                  onChange={(e) =>
                    handleInputChange("sleepHours", e.target.value)
                  }
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 text-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-orange-50 border-b border-orange-100">
            <CardTitle className="text-xl text-orange-900">
              Gejala Fisik
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200"
                >
                  <Checkbox
                    id={symptom.id}
                    checked={formData.symptoms.includes(symptom.name)}
                    onCheckedChange={(checked) =>
                      handleSymptomToggle(symptom.name, checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={symptom.id}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {symptom.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Moods */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-pink-50 border-b border-pink-100">
            <CardTitle className="flex items-center text-xl text-pink-900">
              <Heart className="h-6 w-6 mr-3 text-pink-600" />
              Suasana Hati
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-200"
                >
                  <Checkbox
                    id={mood.id}
                    checked={formData.moods.includes(mood.name)}
                    onCheckedChange={(checked) =>
                      handleMoodToggle(mood.name, checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={mood.id}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
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
                <Select
                  value={formData.sexualActivity}
                  onValueChange={(value) =>
                    handleInputChange("sexualActivity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada</SelectItem>
                    <SelectItem value="unprotected">
                      Seks tanpa perlindungan
                    </SelectItem>
                    <SelectItem value="protected">Seks terlindungi</SelectItem>
                    <SelectItem value="masturbation">Masturbasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Libido</Label>
                <Select
                  value={formData.libido}
                  onValueChange={(value) => handleInputChange("libido", value)}
                >
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
                <Select
                  value={formData.cervixMucus}
                  onValueChange={(value) =>
                    handleInputChange("cervixMucus", value)
                  }
                >
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
                <Select
                  value={formData.cervixPosition}
                  onValueChange={(value) =>
                    handleInputChange("cervixPosition", value)
                  }
                >
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
                <Select
                  value={formData.ovulationTestResult}
                  onValueChange={(value) =>
                    handleInputChange("ovulationTestResult", value)
                  }
                >
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
                <Select
                  value={formData.pregnancyTestResult}
                  onValueChange={(value) =>
                    handleInputChange("pregnancyTestResult", value)
                  }
                >
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
            <Select
              value={formData.sadariResult}
              onValueChange={(value) =>
                handleInputChange("sadariResult", value)
              }
            >
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
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-xl text-purple-900">
              Catatan Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              placeholder="Tulis catatan apa pun tentang perasaan, gejala, atau peristiwa penting hari ini..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={5}
              className="text-base border-2 border-gray-200 focus:border-purple-400 resize-none"
            />
          </CardContent>
        </Card>

        {/* Summary */}
        {(formData.symptoms.length > 0 || formData.moods.length > 0) && (
          <Card className="mb-8 border-0 shadow-lg bg-linear-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">📋 Ringkasan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {formData.symptoms.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-bold text-gray-700 block mb-3">
                    Gejala:{" "}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.symptoms.map((symptom, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-4 py-2 text-sm bg-orange-100 text-orange-800 border border-orange-200"
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.moods.length > 0 && (
                <div>
                  <span className="text-sm font-bold text-gray-700 block mb-3">
                    Mood:{" "}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.moods.map((mood, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-4 py-2 text-sm bg-pink-100 text-pink-800 border-2 border-pink-200"
                      >
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border-0">
          <div className="flex-1">
            {saveMessage && (
              <div
                className={`flex items-center gap-2 text-base font-medium ${
                  saveMessage.includes("Error")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {saveMessage.includes("Error") ? "❌" : "✅"}
                <span>{saveMessage}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 px-8 py-6 text-lg font-semibold"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </main>
    </div>
  );
}
