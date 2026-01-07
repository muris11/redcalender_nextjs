"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useAuthStore } from "@/store/authStore";
import { Calendar, Heart, Save, Ban, Activity, FileText, Droplet, TestTube, Stethoscope } from "lucide-react";
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
    // Set page title
    // document.title = "Log Harian - Red Calendar"; // Handled by metadata

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
      { field: "cervixMucus", name: "Cairan Keputihan" },
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

  // Show unified auth loading
  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isDataLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <LogSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <Heading level={1} size="display-lg" className="mb-3">
          Log Harian Kesehatan
        </Heading>
        <Text variant="body-lg" className="text-muted-foreground max-w-2xl mx-auto">
          Catat aktivitas dan kondisi kesehatan Anda setiap hari untuk pemantauan yang lebih baik
        </Text>
      </div>

        {/* Date Selection & Physical Measurements */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Data Dasar & Pengukuran Fisik</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Date Selection Section */}
            <div className="border-b pb-6">
              <Heading level={3} size="heading-sm" className="mb-4 text-center">
                Pilih Tanggal
              </Heading>
              <div className="flex justify-center">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="text-lg h-14 w-full max-w-xs text-center"
                />
              </div>
            </div>

            {/* Physical Measurements Section */}
            <div>
              <Heading level={3} size="heading-sm" className="mb-4 text-center">
                Pengukuran Fisik
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-semibold flex items-center justify-center">
                    Berat Badan (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="55.5"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="h-14 text-lg text-center"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-sm font-semibold flex items-center justify-center">
                    Suhu Tubuh (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                    className="h-14 text-lg text-center"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterIntake" className="text-sm font-semibold flex items-center justify-center">
                    Asupan Air (ml)
                  </Label>
                  <Input
                    id="waterIntake"
                    type="number"
                    placeholder="2000"
                    value={formData.waterIntake}
                    onChange={(e) => handleInputChange("waterIntake", e.target.value)}
                    className="h-14 text-lg text-center"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleepHours" className="text-sm font-semibold flex items-center justify-center">
                    Durasi Tidur (jam)
                  </Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    step="0.5"
                    placeholder="8"
                    value={formData.sleepHours}
                    onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                    className="h-14 text-lg text-center"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle>Gejala Fisik</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                    className="h-6 w-6"
                  />
                  <img
                    src={symptom.image}
                    alt={symptom.name}
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor={symptom.id}
                    className="text-sm font-medium text-center cursor-pointer"
                  >
                    {symptom.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Moods */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <CardTitle>Suasana Hati</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                    className="h-6 w-6"
                  />
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor={mood.id}
                    className="text-sm font-medium text-center cursor-pointer"
                  >
                    {mood.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sexual & Reproductive Health */}
        <div className="mb-8 space-y-6">
          <div className="text-center">
            <Heading level={2} size="heading-xl" className="mb-2">
              Kesehatan Seksual & Reproduksi
            </Heading>
            <Text variant="body-md" className="text-muted-foreground max-w-3xl mx-auto">
              Informasi penting untuk pemantauan kesehatan reproduksi Anda
            </Text>
          </div>

          {/* Sexual Activity */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Aktivitas Seksual</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.sexualActivity}
                onValueChange={(value) =>
                  handleInputChange("sexualActivity", value)
                }
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {sexualActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                      className="w-16 h-16 object-contain"
                      loading="lazy"
                    />
                    <Label
                      htmlFor={`sexual-${activity.id}`}
                      className="text-sm font-medium text-center cursor-pointer"
                    >
                      {activity.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Cervix Mucus */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Droplet className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Cairan Keputihan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.cervixMucus}
                onValueChange={(value) =>
                  handleInputChange("cervixMucus", value)
                }
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
              >
                <div
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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

          {/* Ovulation Test */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Tes Ovulasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.ovulationTestResult}
                onValueChange={(value) =>
                  handleInputChange("ovulationTestResult", value)
                }
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                <div
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() =>
                    handleInputChange("ovulationTestResult", "negative")
                  }
                >
                  <RadioGroupItem
                    value="negative"
                    id="ovulation-negative"
                    className="text-green-600"
                  />
                  <img
                    src="/tk/negatif.webp"
                    alt="Negatif"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="ovulation-negative"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Negatif
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() =>
                    handleInputChange("ovulationTestResult", "positive")
                  }
                >
                  <RadioGroupItem
                    value="positive"
                    id="ovulation-positive"
                    className="text-green-600"
                  />
                  <img
                    src="/tk/positif.webp"
                    alt="Positif"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    loading="lazy"
                  />
                  <Label
                    htmlFor="ovulation-positive"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer"
                  >
                    Positif
                  </Label>
                </div>
                <div
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-border transition-colors cursor-pointer"
                  onClick={() =>
                    handleInputChange("ovulationTestResult", "not_done")
                  }
                >
                  <RadioGroupItem
                    value="not_done"
                    id="ovulation-not_done"
                    className="text-gray-600"
                  />
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-gray-400">
                    <Ban className="h-10 w-10 sm:h-12 sm:w-12" />
                  </div>
                  <Label
                    htmlFor="ovulation-not_done"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer leading-tight"
                  >
                    Tidak Dilakukan
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Pregnancy Test */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-pink-600" />
                </div>
                <CardTitle>Tes Kehamilan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.pregnancyTestResult}
                onValueChange={(value) =>
                  handleInputChange("pregnancyTestResult", value)
                }
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              >
                <div
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
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
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-yellow-500 transition-colors cursor-pointer"
                  onClick={() =>
                    handleInputChange("pregnancyTestResult", "faint_line")
                  }
                >
                  <RadioGroupItem
                    value="faint_line"
                    id="pregnancy-faint_line"
                    className="text-yellow-600"
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
                <div
                  className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-border transition-colors cursor-pointer"
                  onClick={() =>
                    handleInputChange("pregnancyTestResult", "not_done")
                  }
                >
                  <RadioGroupItem
                    value="not_done"
                    id="pregnancy-not_done"
                    className="text-gray-600"
                  />
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-gray-400">
                    <Ban className="h-10 w-10 sm:h-12 sm:w-12" />
                  </div>
                  <Label
                    htmlFor="pregnancy-not_done"
                    className="text-xs sm:text-sm font-medium text-center cursor-pointer leading-tight"
                  >
                    Tidak Dilakukan
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* SADARI */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-rose-600" />
                </div>
                <CardTitle>SADARI (Periksa Payudara Sendiri)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.sadariResult}
                onValueChange={(value) =>
                  handleInputChange("sadariResult", value)
                }
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
              >
                {[
                  { id: "semuanyabaik", name: "Semuanya Baik", image: "/py/semuanyabaik.webp" },
                  { id: "benjolan", name: "Benjolan", image: "/py/benjolan.webp" },
                  { id: "cairandariputing", name: "Cairan dari Puting", image: "/py/cairandariputing.png" },
                  { id: "gembung", name: "Pembengkakan", image: "/py/gembung.webp" },
                  { id: "kulitkemerahan", name: "Kulit Kemerahan", image: "/py/kulitkemerahan.png" },
                  { id: "lesung", name: "Lesung Pipi/Kulit", image: "/py/lesung.svg" },
                  { id: "nyeri", name: "Nyeri", image: "/py/nyeri.webp" },
                  { id: "putingmerekah", name: "Puting Merekah", image: "/py/putingmerekah.svg" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleInputChange("sadariResult", item.id)}
                  >
                    <RadioGroupItem
                      value={item.id}
                      id={`sadari-${item.id}`}
                      className="text-green-600"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      loading="lazy"
                    />
                    <Label
                      htmlFor={`sadari-${item.id}`}
                      className="text-xs sm:text-sm font-medium text-center cursor-pointer leading-tight"
                    >
                      {item.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <CardTitle>Catatan Tambahan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              placeholder="Tuliskan catatan tambahan mengenai kondisi kesehatan Anda hari ini..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-[150px] text-lg resize-none"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex flex-col items-center gap-4 pb-8">
          {saveMessage && (
            <div
              className={`text-center p-4 rounded-lg w-full max-w-md ${
                saveMessage.includes("Error") || saveMessage.includes("Harap")
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="w-full max-w-md text-white"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Simpan Log Harian
              </>
            )}
          </Button>
        </div>
    </main>
  );
}
