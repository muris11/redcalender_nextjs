"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Heart,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export default function OnboardingContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    birthDate: "",
    menstrualStatus: "",
    lastPeriodDate: "",
    periodDuration: "",
    cycleLength: "",
    commonSymptoms: [],
    severity: "",
    exerciseFrequency: "",
    stressLevel: "",
    sleepQuality: "",
    diet: "",
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Allow access without authentication for onboarding
    // If user is authenticated and already onboarded, redirect to dashboard
    if (isAuthenticated && user?.isOnboarded) {
      // But allow re-access for editing - don't redirect
      // router.push("/dashboard");
    }

    // Load existing onboarding data if user is already onboarded
    if (user?.isOnboarded) {
      setOnboardingData({
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        menstrualStatus: user.menstrualStatus || "",
        lastPeriodDate: user.lastPeriodDate
          ? new Date(user.lastPeriodDate).toISOString().split("T")[0]
          : "",
        periodDuration: user.avgPeriodLength?.toString() || "",
        cycleLength: user.avgCycleLength?.toString() || "",
        commonSymptoms: [], // Note: symptoms data not stored in user model - start empty for editing
        severity: "", // Note: severity data not stored in user model - start empty for editing
        exerciseFrequency: "", // Note: lifestyle data not stored in user model - start empty for editing
        stressLevel: "",
        sleepQuality: "",
        diet: "",
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: string, value: string) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (symptom: string, checked: boolean) => {
    setOnboardingData((prev) => ({
      ...prev,
      commonSymptoms: checked
        ? [...prev.commonSymptoms, symptom]
        : prev.commonSymptoms.filter((s) => s !== symptom),
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.birthDate && onboardingData.menstrualStatus;
      case 2:
        return (
          onboardingData.lastPeriodDate &&
          onboardingData.periodDuration &&
          onboardingData.cycleLength
        );
      case 3:
        return (
          onboardingData.commonSymptoms.length > 0 && onboardingData.severity
        );
      case 4:
        return (
          onboardingData.exerciseFrequency &&
          onboardingData.stressLevel &&
          onboardingData.sleepQuality &&
          onboardingData.diet
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          ...onboardingData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Onboarding completed, received user data:", data.user);

        // Update user in store AND localStorage
        const updatedUser = {
          ...user,
          ...data.user, // Use data from API response
          isOnboarded: true,
          birthDate: new Date(onboardingData.birthDate),
          menstrualStatus: onboardingData.menstrualStatus,
          lastPeriodDate: new Date(onboardingData.lastPeriodDate),
          avgPeriodLength: parseInt(onboardingData.periodDuration),
          avgCycleLength: parseInt(onboardingData.cycleLength),
        };

        console.log("📝 Updating user state with:", {
          email: updatedUser.email,
          isOnboarded: updatedUser.isOnboarded,
        });

        // This will now update both Zustand state AND localStorage
        useAuthStore.getState().setUser(updatedUser);

        toast.success(
          user?.isOnboarded
            ? "Data onboarding berhasil diperbarui!"
            : "Onboarding selesai! Selamat datang di Red Calender!"
        );

        // Redirect to dashboard for first-time onboarding
        router.push(user?.isOnboarded ? "/profile" : "/dashboard");
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Terjadi kesalahan saat menyimpan data onboarding");
    } finally {
      setIsSaving(false);
    }
  };

  const symptoms = [
    "Nyeri perut/kram",
    "Sakit punggung",
    "Sakit kepala",
    "Payudara nyeri/bengkak",
    "Jerawatan",
    "Lelah/mudah capek",
    "Perubahan mood",
    "Nafsu makan berubah",
    "Bloating/perut kembung",
    "Insomnia/sulit tidur",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Informasi Pribadi
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Mari kami kenali lebih baik untuk memberikan analisis yang tepat
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="birthDate"
                  className="text-base font-semibold text-gray-700"
                >
                  Tanggal Lahir
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={onboardingData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="h-12 border-2 focus:border-pink-500 transition-all rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">
                  Status Menstruasi
                </Label>
                <RadioGroup
                  value={onboardingData.menstrualStatus}
                  onValueChange={(value) =>
                    handleInputChange("menstrualStatus", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label
                      htmlFor="regular"
                      className="cursor-pointer font-medium"
                    >
                      Teratur (setiap bulan)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem value="irregular" id="irregular" />
                    <Label
                      htmlFor="irregular"
                      className="cursor-pointer font-medium"
                    >
                      Tidak teratur
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem value="pms" id="pms" />
                    <Label htmlFor="pms" className="cursor-pointer font-medium">
                      Sering PMS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                    <RadioGroupItem value="none" id="none" />
                    <Label
                      htmlFor="none"
                      className="cursor-pointer font-medium"
                    >
                      Belum menstruasi
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Informasi Siklus
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Data ini penting untuk prediksi yang akurat
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="lastPeriodDate"
                  className="text-base font-semibold text-gray-700"
                >
                  Tanggal Hari Pertama Haid Terakhir *
                </Label>
                <Input
                  id="lastPeriodDate"
                  type="date"
                  value={onboardingData.lastPeriodDate}
                  onChange={(e) =>
                    handleInputChange("lastPeriodDate", e.target.value)
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="h-12 border-2 focus:border-purple-500 transition-all rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="periodDuration"
                    className="text-base font-semibold text-gray-700"
                  >
                    Durasi Haid (hari) *
                  </Label>
                  <Select
                    value={onboardingData.periodDuration}
                    onValueChange={(value) =>
                      handleInputChange("periodDuration", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 focus:border-purple-500 rounded-xl">
                      <SelectValue placeholder="Pilih durasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day} hari
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="cycleLength"
                    className="text-base font-semibold text-gray-700"
                  >
                    Panjang Siklus (hari) *
                  </Label>
                  <Select
                    value={onboardingData.cycleLength}
                    onValueChange={(value) =>
                      handleInputChange("cycleLength", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 focus:border-purple-500 rounded-xl">
                      <SelectValue placeholder="Pilih panjang siklus" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 35 }, (_, i) => i + 21).map(
                        (day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day} hari
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100 shadow-sm">
                <p className="text-sm text-blue-800 font-medium">
                  <strong className="text-blue-900">💡 Tip:</strong> Panjang
                  siklus dihitung dari hari pertama haid saat ini hingga hari
                  pertama haid berikutnya.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-pink-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Gejala yang Sering Muncul
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Pilih gejala yang biasa Anda alami
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Checkbox
                      id={symptom}
                      checked={onboardingData.commonSymptoms.includes(symptom)}
                      onCheckedChange={(checked) =>
                        handleSymptomToggle(symptom, checked as boolean)
                      }
                      className="shrink-0"
                    />
                    <Label
                      htmlFor={symptom}
                      className="text-sm cursor-pointer flex-1 leading-tight"
                    >
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Tingkat Keparahan Gejala *</Label>
                <RadioGroup
                  value={onboardingData.severity}
                  onValueChange={(value) =>
                    handleInputChange("severity", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">
                      Ringka - Tidak mengganggu aktivitas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">
                      Sedang - Sedikit mengganggu aktivitas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">
                      Berat - Sangat mengganggu aktivitas
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-pink-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Gaya Hidup
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Informasi gaya hidup membantu analisis lebih akurat
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">Frekuensi Olahraga *</Label>
                <Select
                  value={onboardingData.exerciseFrequency}
                  onValueChange={(value) =>
                    handleInputChange("exerciseFrequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Tidak pernah</SelectItem>
                    <SelectItem value="rarely">Jarang (1-2x/minggu)</SelectItem>
                    <SelectItem value="sometimes">
                      Kadang (3-4x/minggu)
                    </SelectItem>
                    <SelectItem value="often">Sering (5-6x/minggu)</SelectItem>
                    <SelectItem value="daily">Setiap hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stressLevel">Tingkat Stres *</Label>
                <Select
                  value={onboardingData.stressLevel}
                  onValueChange={(value) =>
                    handleInputChange("stressLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah - Santai</SelectItem>
                    <SelectItem value="moderate">Sedang - Normal</SelectItem>
                    <SelectItem value="high">Tinggi - Sering stres</SelectItem>
                    <SelectItem value="very_high">
                      Sangat tinggi - Stres berat
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleepQuality">Kualitas Tidur *</Label>
                <Select
                  value={onboardingData.sleepQuality}
                  onValueChange={(value) =>
                    handleInputChange("sleepQuality", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">
                      Sangat baik (7-9 jam)
                    </SelectItem>
                    <SelectItem value="good">Baik (6-7 jam)</SelectItem>
                    <SelectItem value="fair">Cukup (5-6 jam)</SelectItem>
                    <SelectItem value="poor">Buruk (&lt;5 jam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diet">Pola Makan *</Label>
                <Select
                  value={onboardingData.diet}
                  onValueChange={(value) => handleInputChange("diet", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">
                      Seimbang - Sayur, protein, karbohidrat
                    </SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="irregular">Tidak teratur</SelectItem>
                    <SelectItem value="fast_food">
                      Sering makan junk food
                    </SelectItem>
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                {user?.isOnboarded
                  ? "✏️ Edit Data Onboarding"
                  : "🌸 Selamat Datang"}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4">
                {user?.isOnboarded
                  ? "Perbarui informasi profil kesehatan Anda"
                  : "Mari kita kenali profil kesehatan Anda"}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6 px-2 sm:px-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex-1 relative">
                    <div className="flex items-center">
                      <div
                        className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-linear-to-br from-pink-500 to-purple-600 text-white shadow-lg scale-105 sm:scale-110"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {currentStep > step ? "✓" : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`flex-1 h-1.5 sm:h-2 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                            currentStep > step
                              ? "bg-linear-to-r from-pink-500 to-purple-600"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="absolute top-12 sm:top-14 left-0 right-0 text-center">
                      <p
                        className={`text-xs font-semibold ${
                          currentStep >= step
                            ? "text-pink-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step === 1 && "Pribadi"}
                        {step === 2 && "Siklus"}
                        {step === 3 && "Gejala"}
                        {step === 4 && "Hidup"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600 px-2">
                <span>
                  Langkah {currentStep} dari {totalSteps}
                </span>
                <span className="text-pink-600 font-bold">
                  {Math.round(progressPercentage)}% Selesai
                </span>
              </div>
            </div>

            {/* Step Content */}
            <Card className="border-0 shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="h-3 bg-linear-to-r from-pink-400 via-purple-400 to-pink-400"></div>
              <CardHeader className="bg-linear-to-r from-pink-50 to-purple-50 pb-6">
                <CardTitle className="text-center text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {currentStep === 1 && "👤 Informasi Pribadi"}
                  {currentStep === 2 && "📅 Data Siklus"}
                  {currentStep === 3 && "💊 Gejala PMS"}
                  {currentStep === 4 && "❤️ Gaya Hidup"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 lg:p-10">
                {renderStep()}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="border-2 border-gray-300 hover:border-pink-400 hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-semibold px-4 sm:px-6 py-4 sm:py-6 rounded-xl transition-all disabled:opacity-50 order-2 sm:order-1"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm sm:text-base">Sebelumnya</span>
                  </Button>

                  {currentStep === totalSteps ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!validateStep() || isSaving}
                      className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all font-bold px-6 sm:px-8 py-4 sm:py-6 rounded-xl border-0 disabled:opacity-50 order-1 sm:order-2"
                    >
                      <span className="text-sm sm:text-base">
                        {isSaving
                          ? "Menyimpan..."
                          : user?.isOnboarded
                          ? "💾 Update Data"
                          : "✨ Selesai Onboarding"}
                      </span>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!validateStep()}
                      className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all font-bold px-6 sm:px-8 py-4 sm:py-6 rounded-xl border-0 disabled:opacity-50 order-1 sm:order-2"
                    >
                      <span className="text-sm sm:text-base">Selanjutnya</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <div className="mt-6 sm:mt-8 bg-linear-to-r from-blue-50 to-indigo-50 border-0 shadow-lg rounded-2xl p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-md">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-blue-900 mb-2">
                    💡 Mengapa Data Ini Penting?
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Data yang Anda berikan akan membantu kami memberikan
                    analisis siklus yang lebih akurat, prediksi yang lebih
                    tepat, dan saran kesehatan yang personal sesuai kondisi
                    Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
