"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
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
    ArrowLeft,
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
  currentlyMenstruating: string; // yes, no, unsure, prefer_not
  menstrualStatus: string;

  // Step 2: Last Period Info
  lastPeriodDate: string;
  lastPeriodEndDate: string;
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
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    birthDate: "",
    currentlyMenstruating: "",
    menstrualStatus: "",
    lastPeriodDate: "",
    lastPeriodEndDate: "",
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
    if (isAuthenticated && user?.isOnboarded) {
      // Allow re-access for editing
    }

    if (!user?.id) return;

    let storedData: Partial<OnboardingData> | null = null;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`redcalendar_onboarding_${user.id}`);
        storedData = raw ? JSON.parse(raw) : null;
      } catch {
        storedData = null;
      }
    }

    if (user?.isOnboarded || storedData) {
      setOnboardingData({
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : storedData?.birthDate || "",
        currentlyMenstruating: (user as any).currentlyMenstruating || storedData?.currentlyMenstruating || "",
        menstrualStatus: user.menstrualStatus || storedData?.menstrualStatus || "",
        lastPeriodDate: user.lastPeriodDate
          ? new Date(user.lastPeriodDate).toISOString().split("T")[0]
          : storedData?.lastPeriodDate || "",
        lastPeriodEndDate: (user as any).lastPeriodEndDate
          ? new Date((user as any).lastPeriodEndDate).toISOString().split("T")[0]
          : storedData?.lastPeriodEndDate || "",
        periodDuration: user.avgPeriodLength?.toString() || storedData?.periodDuration || "",
        cycleLength: user.avgCycleLength?.toString() || storedData?.cycleLength || "",
        commonSymptoms: storedData?.commonSymptoms || [],
        severity: storedData?.severity || "",
        exerciseFrequency: storedData?.exerciseFrequency || "",
        stressLevel: storedData?.stressLevel || "",
        sleepQuality: storedData?.sleepQuality || "",
        diet: storedData?.diet || "",
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
        return onboardingData.birthDate && onboardingData.currentlyMenstruating && onboardingData.menstrualStatus;
      case 2:
        return (
          onboardingData.lastPeriodDate &&
          onboardingData.lastPeriodEndDate &&
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
        const updatedUser = {
          ...user,
          ...data.user,
          isOnboarded: true,
          birthDate: new Date(onboardingData.birthDate),
          menstrualStatus: onboardingData.menstrualStatus,
          lastPeriodDate: new Date(onboardingData.lastPeriodDate),
          avgPeriodLength: parseInt(onboardingData.periodDuration),
          avgCycleLength: parseInt(onboardingData.cycleLength),
        };

        useAuthStore.getState().setUser(updatedUser);

        if (typeof window !== "undefined" && user?.id) {
          localStorage.setItem(
            `redcalendar_onboarding_${user.id}`,
            JSON.stringify(onboardingData)
          );
        }

        toast.success(
          user?.isOnboarded
            ? "Data onboarding berhasil diperbarui!"
            : "Onboarding selesai! Selamat datang di Red Calender!"
        );

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
            <div className="space-y-2">
              <Label htmlFor="birthDate">Tanggal Lahir</Label>
              <Input
                id="birthDate"
                type="date"
                value={onboardingData.birthDate}
                onChange={(e) =>
                  handleInputChange("birthDate", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Apakah saat ini Anda sedang menstruasi?</Label>
              <RadioGroup
                value={onboardingData.currentlyMenstruating}
                onValueChange={(value) =>
                  handleInputChange("currentlyMenstruating", value)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="currently_yes" />
                  <Label htmlFor="currently_yes" className="cursor-pointer font-normal">
                    Sedang menstruasi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="currently_no" />
                  <Label htmlFor="currently_no" className="cursor-pointer font-normal">
                    Tidak sedang menstruasi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id="currently_unsure" />
                  <Label htmlFor="currently_unsure" className="cursor-pointer font-normal">
                    Tidak yakin
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer_not" id="currently_prefer_not" />
                  <Label htmlFor="currently_prefer_not" className="cursor-pointer font-normal">
                    Tidak ingin menjawab
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Status Menstruasi (dalam 3 bulan terakhir)</Label>
              <RadioGroup
                value={onboardingData.menstrualStatus}
                onValueChange={(value) =>
                  handleInputChange("menstrualStatus", value)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular" className="cursor-pointer font-normal">
                    Teratur
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="irregular" id="irregular" />
                  <Label htmlFor="irregular" className="cursor-pointer font-normal">
                    Tidak teratur
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never" className="cursor-pointer font-normal">
                    Belum pernah menstruasi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer_not" id="prefer_not" />
                  <Label htmlFor="prefer_not" className="cursor-pointer font-normal">
                    Tidak ingin menjawab
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lastPeriodDate">
                Tanggal Hari Pertama Haid Terakhir
              </Label>
              <Input
                id="lastPeriodDate"
                type="date"
                value={onboardingData.lastPeriodDate}
                onChange={(e) =>
                  handleInputChange("lastPeriodDate", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastPeriodEndDate">
                Tanggal Hari Terakhir Haid Terakhir
              </Label>
              <Input
                id="lastPeriodEndDate"
                type="date"
                value={onboardingData.lastPeriodEndDate}
                onChange={(e) =>
                  handleInputChange("lastPeriodEndDate", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                min={onboardingData.lastPeriodDate}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="periodDuration">Durasi Haid (hari)</Label>
                <Select
                  value={onboardingData.periodDuration}
                  onValueChange={(value) =>
                    handleInputChange("periodDuration", value)
                  }
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="cycleLength">Panjang Siklus (hari)</Label>
                <Select
                  value={onboardingData.cycleLength}
                  onValueChange={(value) =>
                    handleInputChange("cycleLength", value)
                  }
                >
                  <SelectTrigger>
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

            <div className="p-3 rounded-lg bg-muted border">
              <Text variant="body-sm" className="text-muted-foreground">
                <strong>Tip:</strong> Panjang siklus dihitung dari hari pertama haid saat ini hingga hari pertama haid berikutnya.
              </Text>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Gejala yang Sering Muncul</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={symptom}
                      checked={onboardingData.commonSymptoms.includes(symptom)}
                      onCheckedChange={(checked) =>
                        handleSymptomToggle(symptom, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={symptom}
                      className="cursor-pointer font-normal"
                    >
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tingkat Keparahan Gejala</Label>
              <RadioGroup
                value={onboardingData.severity}
                onValueChange={(value) =>
                  handleInputChange("severity", value)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="mild" />
                  <Label htmlFor="mild" className="cursor-pointer font-normal">
                    Ringan - Tidak mengganggu aktivitas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate" className="cursor-pointer font-normal">
                    Sedang - Sedikit mengganggu aktivitas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="severe" />
                  <Label htmlFor="severe" className="cursor-pointer font-normal">
                    Berat - Sangat mengganggu aktivitas
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exerciseFrequency">Frekuensi Olahraga</Label>
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
                  <SelectItem value="sometimes">Kadang (3-4x/minggu)</SelectItem>
                  <SelectItem value="often">Sering (5-6x/minggu)</SelectItem>
                  <SelectItem value="daily">Setiap hari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stressLevel">Tingkat Stres</Label>
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
                  <SelectItem value="very_high">Sangat tinggi - Stres berat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepQuality">Kualitas Tidur</Label>
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
                  <SelectItem value="excellent">Sangat baik (7-9 jam)</SelectItem>
                  <SelectItem value="good">Baik (6-7 jam)</SelectItem>
                  <SelectItem value="fair">Cukup (5-6 jam)</SelectItem>
                  <SelectItem value="poor">Buruk (&lt;5 jam)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diet">Pola Makan</Label>
              <Select
                value={onboardingData.diet}
                onValueChange={(value) => handleInputChange("diet", value)}
              >
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
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <UnifiedPageLoading />;
  }

  const stepTitles = [
    { icon: User, title: "Informasi Pribadi", description: "Mari kami kenali lebih baik untuk memberikan analisis yang tepat" },
    { icon: Calendar, title: "Informasi Siklus", description: "Data ini penting untuk prediksi yang akurat" },
    { icon: Activity, title: "Gejala yang Sering Muncul", description: "Pilih gejala yang biasa Anda alami" },
    { icon: Heart, title: "Gaya Hidup", description: "Informasi gaya hidup membantu analisis lebih akurat" },
  ];

  const currentStepInfo = stepTitles[currentStep - 1];
  const StepIcon = currentStepInfo.icon;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Heading level="1" size="heading-xl" className="mb-2">
          {user?.isOnboarded ? "Edit Data Onboarding" : "Selamat Datang"}
        </Heading>
        <Text variant="body-md" className="text-muted-foreground">
          {user?.isOnboarded
            ? "Perbarui informasi profil kesehatan Anda"
            : "Mari kita kenali profil kesehatan Anda"}
        </Text>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1 relative">
              <div className="flex items-center">
                <div
                  className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-0.5 sm:h-1 mx-1.5 sm:mx-2 transition-colors ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 text-center px-1 sm:absolute sm:top-12 sm:left-0 sm:right-0 sm:mt-0">
                <Text
                  variant="body-xs"
                  className={`text-[11px] sm:text-xs ${currentStep >= step ? "text-primary" : "text-muted-foreground"}`}
                >
                  {step === 1 && "Pribadi"}
                  {step === 2 && "Siklus"}
                  {step === 3 && "Gejala"}
                  {step === 4 && "Hidup"}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-between gap-2 text-sm">
          <Text variant="body-sm" className="text-muted-foreground">
            Langkah {currentStep} dari {totalSteps}
          </Text>
          <Text variant="body-sm" className="text-primary font-semibold sm:text-right">
            {Math.round(progressPercentage)}% Selesai
          </Text>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <StepIcon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>{currentStepInfo.title}</CardTitle>
          </div>
          <CardDescription>{currentStepInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse gap-3 mt-8 pt-6 border-t sm:flex-row sm:justify-between sm:gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sebelumnya
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep() || isSaving}
                className="w-full text-white sm:w-auto"
              >
                {isSaving
                  ? "Menyimpan..."
                  : user?.isOnboarded
                  ? "Update Data"
                  : "Selesai Onboarding"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!validateStep()}
                className="w-full text-white sm:w-auto"
              >
                Selanjutnya
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
