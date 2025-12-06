"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoading } from "@/components/ui/loading";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { Calendar, Heart, Save } from "lucide-react";
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
    {
      id: "back_pain",
      name: "Sakit punggung",
      category: "pain",
      image: "/gf/sakitpunggung.svg",
    },
    {
      id: "headache",
      name: "Sakit kepala",
      category: "pain",
      image: "/gf/sakitkepala.webp",
    },
    {
      id: "cramps",
      name: "Kram otot",
      category: "pain",
      image: "/gf/kelelahan.webp",
    },
    {
      id: "pelvic_pain",
      name: "Nyeri panggul",
      category: "pain",
      image: "/gf/nyeripunggung.webp",
    },
    {
      id: "breast_tenderness",
      name: "Sensitif payudara",
      category: "pain",
      image: "/gf/sensitifpayudara.webp",
    },
    {
      id: "acne",
      name: "Jerawatan",
      category: "skin",
      image: "/gf/jerawatan.webp",
    },
    {
      id: "fatigue",
      name: "Kelelahan",
      category: "physical",
      image: "/gf/kelelahan.webp",
    },
    {
      id: "spotting",
      name: "Bercak darah",
      category: "physical",
      image: "/gf/bercakdarah.webp",
    },
  ];

  const moods = [
    { id: "happy", name: "Riang", image: "/sh/riang.webp" },
    {
      id: "in_love",
      name: "Jatuh cinta",
      image: "/sh/jatuhcinta.png",
    },
    { id: "angry", name: "Pemarah", image: "/sh/pemarah.svg" },
    { id: "tired", name: "Lelah", image: "/sh/lelah.webp" },
    { id: "sad", name: "Berduka", image: "/sh/berduka.webp" },
    {
      id: "depressed",
      name: "Depresi",
      image: "/sh/depresi.svg",
    },
    {
      id: "emotional",
      name: "Emosional",
      image: "/sh/emosional.webp",
    },
    { id: "anxious", name: "Cemas", image: "/sh/cemas.webp" },
  ];

  const sexualActivities = [
    { id: "tidakada", name: "Tidak ada", image: "/as/tidakada.webp" },
    {
      id: "sexstanpaperlindungan",
      name: "Seks tanpa perlindungan",
      image: "/as/sekstanpaperlindungan.webp",
    },
    {
      id: "seksterlindungi",
      name: "Seks terlindungi",
      image: "/as/seksterlindungi.png",
    },
    { id: "gairahseks", name: "Gairah Seks", image: "/as/gairahseks.webp" },
    {
      id: "tanpaorgasme",
      name: "Tanpa Orgasme",
      image: "/as/tanpaorgasme.webp",
    },
    { id: "masturbation", name: "Masturbasi", image: "/as/masturbasi.webp" },
    { id: "orgasme", name: "orgasme", image: "/as/orgasme.webp" },
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

    // Validation: Check if all required fields are filled
    const requiredFields = [
      { field: "sexualActivity", name: "Aktivitas Seksual" },
      { field: "cervixMucus", name: "Mukus Serviks" },
      { field: "cervixPosition", name: "Posisi Serviks" },
      { field: "ovulationTestResult", name: "Tes Ovulasi" },
      { field: "pregnancyTestResult", name: "Tes Kehamilan" },
      { field: "sadariResult", name: "SADARI" },
    ];

    const missingFields = requiredFields.filter(
      (req) => !formData[req.field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      setSaveMessage(
        `Harap lengkapi semua field yang diperlukan: ${missingFields
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // Validation: Check if at least one symptom and one mood is selected
    if (formData.symptoms.length === 0) {
      setSaveMessage("Harap pilih setidaknya satu gejala fisik");
      return;
    }

    if (formData.moods.length === 0) {
      setSaveMessage("Harap pilih setidaknya satu suasana hati");
      return;
    }

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
        setSaveMessage("Data berhasil disimpan!");
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Log Harian Kesehatan
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            Catat aktivitas dan kondisi kesehatan Anda setiap hari untuk
            pemantauan yang lebih baik
          </p>
        </div>

        {/* Date Selection & Physical Measurements */}
        <Card className="mb-6 sm:mb-8 lg:mb-10 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
          <div className="bg-linear-to-r from-rose-500 via-pink-500 to-blue-500 p-4 sm:p-6 rounded-t-lg">
            <CardTitle className="flex items-center justify-center sm:justify-start text-white text-lg sm:text-xl">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              Data Dasar & Pengukuran Fisik
            </CardTitle>
          </div>
          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Date Selection Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 text-center">
                Pilih Tanggal
              </h3>
              <div className="flex justify-center">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="text-lg h-14 border-2 border-gray-200 focus:border-pink-400 rounded-lg w-full max-w-xs text-center"
                />
              </div>
            </div>

            {/* Physical Measurements Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 text-center">
                Pengukuran Fisik
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="weight"
                    className="text-sm sm:text-base font-semibold text-gray-700 flex items-center justify-center"
                  >
                    Berat Badan (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="55.5"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="h-12 sm:h-14 border-2 border-gray-200 focus:border-blue-400 text-base sm:text-lg text-center rounded-lg transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="temperature"
                    className="text-sm sm:text-base font-semibold text-gray-700 flex items-center justify-center"
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
                    className="h-12 sm:h-14 border-2 border-gray-200 focus:border-blue-400 text-base sm:text-lg text-center rounded-lg transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="waterIntake"
                    className="text-sm sm:text-base font-semibold text-gray-700 flex items-center justify-center"
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
                    className="h-12 sm:h-14 border-2 border-gray-200 focus:border-blue-400 text-base sm:text-lg text-center rounded-lg transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="sleepHours"
                    className="text-sm sm:text-base font-semibold text-gray-700 flex items-center justify-center"
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
                    className="h-12 sm:h-14 border-2 border-gray-200 focus:border-blue-400 text-base sm:text-lg text-center rounded-lg transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="mb-6 sm:mb-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-linear-to-r from-orange-500 to-red-500 p-4 sm:p-6 rounded-t-lg">
            <CardTitle className="text-white text-lg sm:text-xl text-center">
              Gejala Fisik
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleSymptomToggle(
                      symptom.name,
                      !formData.symptoms.includes(symptom.name)
                    )
                  }
                >
                  <Checkbox
                    id={symptom.id}
                    checked={formData.symptoms.includes(symptom.name)}
                    onCheckedChange={(checked) =>
                      handleSymptomToggle(symptom.name, checked as boolean)
                    }
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                  <img
                    src={symptom.image}
                    alt={symptom.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor={symptom.id}
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer leading-tight"
                  >
                    {symptom.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Moods */}
        <Card className="mb-6 sm:mb-8 lg:mb-10 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-linear-to-r from-pink-500 to-rose-500 p-4 sm:p-6 rounded-t-lg">
            <CardTitle className="flex items-center text-white text-lg sm:text-xl justify-center">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              Suasana Hati
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleMoodToggle(
                      mood.name,
                      !formData.moods.includes(mood.name)
                    )
                  }
                >
                  <Checkbox
                    id={mood.id}
                    checked={formData.moods.includes(mood.name)}
                    onCheckedChange={(checked) =>
                      handleMoodToggle(mood.name, checked as boolean)
                    }
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor={mood.id}
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer leading-tight"
                  >
                    {mood.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sexual & Reproductive Health */}
        <div className="mb-8 sm:mb-10 lg:mb-12 space-y-6 sm:space-y-8">
          <div className="text-center px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mb-2">
              Kesehatan Seksual & Reproduksi
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
              Informasi penting untuk pemantauan kesehatan reproduksi Anda
            </p>
          </div>

          {/* Sexual Activity */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-t-lg">
              <CardTitle className="flex items-center text-white text-lg sm:text-xl justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Aktivitas Seksual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <RadioGroup
                value={formData.sexualActivity}
                onValueChange={(value) =>
                  handleInputChange("sexualActivity", value)
                }
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
              >
                {sexualActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                    onClick={() =>
                      handleInputChange("sexualActivity", activity.id)
                    }
                  >
                    <RadioGroupItem
                      value={activity.id}
                      id={`sexual-${activity.id}`}
                      className="text-green-600"
                    />
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      loading="lazy"
                    />
                    <Label
                      htmlFor={`sexual-${activity.id}`}
                      className="text-xs sm:text-sm font-medium text-center cursor-pointer leading-tight"
                    >
                      {activity.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Cervix Mucus */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-t-lg">
              <CardTitle className="flex items-center text-white text-lg sm:text-xl justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Mukus Serviks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <RadioGroup
                value={formData.cervixMucus}
                onValueChange={(value) =>
                  handleInputChange("cervixMucus", value)
                }
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
              >
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixMucus", "dry")}
                >
                  <RadioGroupItem
                    value="dry"
                    id="mucus-dry"
                    className="text-green-600"
                  />
                  <img
                    src="/ms/kering.webp"
                    alt="Kering"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="mucus-dry"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Kering
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixMucus", "sticky")}
                >
                  <RadioGroupItem
                    value="sticky"
                    id="mucus-sticky"
                    className="text-green-600"
                  />
                  <img
                    src="/ms/lengket.webp"
                    alt="Lengket"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="mucus-sticky"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Lengket
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixMucus", "creamy")}
                >
                  <RadioGroupItem
                    value="creamy"
                    id="mucus-creamy"
                    className="text-green-600"
                  />
                  <img
                    src="/ms/sepertikrimkeruh.webp"
                    alt="Seperti Krim"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="mucus-creamy"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Seperti Krim
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixMucus", "watery")}
                >
                  <RadioGroupItem
                    value="watery"
                    id="mucus-watery"
                    className="text-green-600"
                  />
                  <img
                    src="/ms/encer.svg"
                    alt="Encer"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="mucus-watery"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Encer
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixMucus", "egg_white")}
                >
                  <RadioGroupItem
                    value="egg_white"
                    id="mucus-egg_white"
                    className="text-green-600"
                  />
                  <img
                    src="/ms/putihtelur.webp"
                    alt="Putih Telur"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="mucus-egg_white"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Putih Telur
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Cervix Position */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-t-lg">
              <CardTitle className="flex items-center text-white text-lg sm:text-xl justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Posisi Serviks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <RadioGroup
                value={formData.cervixPosition}
                onValueChange={(value) =>
                  handleInputChange("cervixPosition", value)
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixPosition", "low")}
                >
                  <RadioGroupItem
                    value="low"
                    id="position-low"
                    className="text-green-600"
                  />
                  <img
                    src="/ps/rendah.webp"
                    alt="Rendah"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="position-low"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Rendah
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixPosition", "medium")}
                >
                  <RadioGroupItem
                    value="medium"
                    id="position-medium"
                    className="text-green-600"
                  />
                  <img
                    src="/ps/sedang.webp"
                    alt="Sedang"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="position-medium"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Sedang
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("cervixPosition", "high")}
                >
                  <RadioGroupItem
                    value="high"
                    id="position-high"
                    className="text-green-600"
                  />
                  <img
                    src="/ps/tinggi.webp"
                    alt="Tinggi"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="position-high"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Tinggi
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Ovulation Test */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-t-lg">
              <CardTitle className="flex items-center text-white text-lg sm:text-xl justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Tes Ovulasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <RadioGroup
                value={formData.ovulationTestResult}
                onValueChange={(value) =>
                  handleInputChange("ovulationTestResult", value)
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleInputChange("ovulationTestResult", "low")
                  }
                >
                  <RadioGroupItem
                    value="low"
                    id="ovulation-low"
                    className="text-green-600"
                  />
                  <img
                    src="/ps/rendah.webp"
                    alt="Rendah"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="ovulation-low"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Rendah
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleInputChange("ovulationTestResult", "high")
                  }
                >
                  <RadioGroupItem
                    value="high"
                    id="ovulation-high"
                    className="text-green-600"
                  />
                  <img
                    src="/ps/sedang.webp"
                    alt="Tinggi"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="ovulation-high"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Tinggi
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleInputChange("ovulationTestResult", "peak")
                  }
                >
                  <RadioGroupItem
                    value="peak"
                    id="ovulation-peak"
                    className="text-green-600"
                  />
                  <img
                    src="/ps/tinggi.webp"
                    alt="Puncak"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="ovulation-peak"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Puncak
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Pregnancy Test */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-t-lg">
              <CardTitle className="flex items-center text-white text-lg sm:text-xl justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Tes Kehamilan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <RadioGroup
                value={formData.pregnancyTestResult}
                onValueChange={(value) =>
                  handleInputChange("pregnancyTestResult", value)
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleInputChange("pregnancyTestResult", "positive")
                  }
                >
                  <RadioGroupItem
                    value="positive"
                    id="pregnancy-positive"
                    className="text-green-600"
                  />
                  <img
                    src="/tk/positif.webp"
                    alt="Positif"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="pregnancy-positive"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Positif
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleInputChange("pregnancyTestResult", "negative")
                  }
                >
                  <RadioGroupItem
                    value="negative"
                    id="pregnancy-negative"
                    className="text-green-600"
                  />
                  <img
                    src="/tk/negatif.webp"
                    alt="Negatif"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="pregnancy-negative"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Negatif
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() =>
                    handleInputChange("pregnancyTestResult", "faint_line")
                  }
                >
                  <RadioGroupItem
                    value="faint_line"
                    id="pregnancy-faint_line"
                    className="text-green-600"
                  />
                  <img
                    src="/tk/garissamar.webp"
                    alt="Garis Samar"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="pregnancy-faint_line"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Garis Samar
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* SADARI */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-teal-50 border-b border-teal-100">
            <CardTitle className="flex items-center text-xl text-teal-900">
              <Heart className="h-6 w-6 mr-3 text-teal-600" />
              SADARI (Periksa Payudara Sendiri)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-700 block text-center">
                Hasil Pemeriksaan
              </Label>
              <RadioGroup
                value={formData.sadariResult}
                onValueChange={(value) =>
                  handleInputChange("sadariResult", value)
                }
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("sadariResult", "normal")}
                >
                  <RadioGroupItem
                    value="normal"
                    id="sadari-normal"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/semuanyabaik.webp"
                    alt="Semua Baik"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-normal"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Semua Baik
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("sadariResult", "lump")}
                >
                  <RadioGroupItem
                    value="lump"
                    id="sadari-lump"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/benjolan.webp"
                    alt="Benjolan"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-lump"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Benjolan
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("sadariResult", "pain")}
                >
                  <RadioGroupItem
                    value="pain"
                    id="sadari-pain"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/nyeri.webp"
                    alt="Nyeri"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-pain"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Nyeri
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleInputChange("sadariResult", "discharge")}
                >
                  <RadioGroupItem
                    value="discharge"
                    id="sadari-discharge"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/cairandariputing.png"
                    alt="Cairan dari Puting"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-discharge"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Cairan dari Puting
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleInputChange("sadariResult", "redness")}
                >
                  <RadioGroupItem
                    value="redness"
                    id="sadari-redness"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/kulitkemerahan.png"
                    alt="Kulit Kemerahan"
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-redness"
                    className="text-sm font-medium text-center cursor-pointer"
                  >
                    Kulit Kemerahan
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleInputChange("sadariResult", "cracked")}
                >
                  <RadioGroupItem
                    value="cracked"
                    id="sadari-cracked"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/putingmerekah.svg"
                    alt="Puting Merekah"
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-cracked"
                    className="text-sm font-medium text-center cursor-pointer"
                  >
                    Puting Merekah
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleInputChange("sadariResult", "swollen")}
                >
                  <RadioGroupItem
                    value="swollen"
                    id="sadari-swollen"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/gembung.webp"
                    alt="Gembung"
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-swollen"
                    className="text-sm font-medium text-center cursor-pointer"
                  >
                    Gembung
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleInputChange("sadariResult", "dimpling")}
                >
                  <RadioGroupItem
                    value="dimpling"
                    id="sadari-dimpling"
                    className="text-teal-600"
                  />
                  <img
                    src="/py/lesung.svg"
                    alt="Lesung"
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="sadari-dimpling"
                    className="text-sm font-medium text-center cursor-pointer"
                  >
                    Lesung
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-6 sm:mb-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-purple-50 border-b border-purple-100 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-purple-900 text-center sm:text-left">
              Catatan Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Textarea
              placeholder="Tulis catatan apa pun tentang perasaan, gejala, atau peristiwa penting hari ini..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
              className="text-sm sm:text-base border-2 border-gray-200 focus:border-purple-400 resize-none transition-colors duration-200"
            />
          </CardContent>
        </Card>

        {/* Summary */}
        {(formData.symptoms.length > 0 || formData.moods.length > 0) && (
          <Card className="mb-6 sm:mb-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-linear-to-br from-gray-50 to-gray-100">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl text-center sm:text-left">
                📋 Ringkasan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {formData.symptoms.length > 0 && (
                <div className="mb-4 sm:mb-5">
                  <span className="text-xs sm:text-sm font-bold text-gray-700 block mb-2 sm:mb-3">
                    Gejala:{" "}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.symptoms.map((symptom, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-orange-100 text-orange-800 border border-orange-200"
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.moods.length > 0 && (
                <div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700 block mb-2 sm:mb-3">
                    Mood:{" "}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.moods.map((mood, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-pink-100 text-pink-800 border-2 border-pink-200"
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
        <div className="flex flex-col items-center gap-4 sm:gap-6 bg-white/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border-0">
          <div className="w-full max-w-md">
            {saveMessage && (
              <div
                className={`flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium p-3 sm:p-4 rounded-lg border-2 ${
                  saveMessage.includes("Error") || saveMessage.includes("Harap")
                    ? "text-red-700 bg-red-50 border-red-200"
                    : "text-green-700 bg-green-50 border-green-200"
                }`}
              >
                {saveMessage.includes("Error") || saveMessage.includes("Harap")
                  ? "⚠️"
                  : "✅"}
                <span className="text-center">{saveMessage}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg lg:text-xl font-semibold w-full max-w-sm rounded-xl"
          >
            <Save className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </Button>

          <p className="text-xs sm:text-sm text-gray-500 text-center max-w-md px-4">
            Pastikan semua field yang diperlukan telah diisi sebelum menyimpan
            data kesehatan Anda
          </p>
        </div>
      </main>
    </div>
  );
}
