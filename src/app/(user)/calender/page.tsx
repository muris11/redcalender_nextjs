"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useAuthStore } from "@/store/authStore";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Droplet, Sprout, Flower2, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  phase?: "menstrual" | "follicular" | "ovulation" | "luteal";
  cycleDay?: number;
  hasData?: boolean;
}

export default function CalendarContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    // Set page title
    // document.title = "Kalender - Red Calendar"; // Handled by metadata

    // Wait until auth state has initialized
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.id) {
      setIsDataLoading(false);
      return;
    }

    loadCalendarData(currentDate);
  }, [isAuthenticated, isLoading, router, currentDate, user?.id]);

  const loadCalendarData = async (date: Date) => {
    if (!user?.id) {
      setIsDataLoading(false);
      return;
    }

    try {
      setIsDataLoading(true);
      const apiUrl = `/api/user/calendar?userId=${
        user.id
      }&year=${date.getFullYear()}&month=${date.getMonth()}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch calendar data");
      }

      const data = await response.json();

      // Transform API data to CalendarDay format
      if (data.calendarData && Array.isArray(data.calendarData)) {
        const transformedDays: CalendarDay[] = data.calendarData.map(
          (day: any) => ({
            date: new Date(day.date),
            isCurrentMonth: day.isCurrentMonth,
            isToday: day.isToday,
            phase: day.phase,
            cycleDay: day.cycleDay,
            hasData: day.hasData,
          })
        );

        setCalendarDays(transformedDays);
      } else {
        generateBasicCalendar(date);
      }
    } catch (error) {
      console.error("Calendar: Error loading calendar data:", error);
      // Fallback to basic calendar without cycle data
      generateBasicCalendar(date);
    } finally {
      setIsDataLoading(false);
    }
  };

  const generateBasicCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    // Adjust starting day of week for Monday-first calendar
    // getDay() returns 0=Sunday, 1=Monday, etc.
    // We want Monday=0, Tuesday=1, ..., Sunday=6
    const jsDayOfWeek = firstDayOfMonth.getDay();
    const startingDayOfWeek = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    const today = new Date();
    // Use local date instead of UTC for accurate today detection
    const todayString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDayDate = new Date(year, month, i);
      const currentDayString = `${currentDayDate.getFullYear()}-${String(
        currentDayDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDayDate.getDate()).padStart(2, "0")}`;
      const isToday = currentDayString === todayString;

      days.push({
        date: currentDayDate,
        isCurrentMonth: true,
        isToday,
        hasData: false,
        phase: undefined, // Explicitly undefined for basic calendar
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    setCalendarDays(days);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: CalendarDay) => {
    const dateStr = day.date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    router.push(`/log?date=${dateStr}`);
  };

  const getPhaseColor = (phase?: string) => {
    switch (phase) {
      case "menstrual":
        return "bg-red-50 border-red-200 hover:border-red-300";
      case "follicular":
        return "bg-green-50 border-green-200 hover:border-green-300";
      case "ovulation":
        return "bg-purple-50 border-purple-200 hover:border-purple-300";
      case "luteal":
        return "bg-blue-50 border-blue-200 hover:border-blue-300";
      default:
        return "hover:bg-muted border-border";
    }
  };

  const PhaseIcon = ({ phase }: { phase?: string }) => {
    switch (phase) {
      case "menstrual":
        return <Droplet className="h-4 w-4 text-red-600" />;
      case "follicular":
        return <Sprout className="h-4 w-4 text-green-600" />;
      case "ovulation":
        return <Flower2 className="h-4 w-4 text-purple-600" />;
      case "luteal":
        return <Moon className="h-4 w-4 text-blue-600" />;
      default:
        return null;
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
      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <CalendarSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Month Navigation - Clean */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Heading level={2} size="heading-lg">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Heading>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wide py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  relative p-2 rounded-lg border transition-colors min-h-16 lg:min-h-20 flex flex-col items-center justify-start cursor-pointer
                  ${
                    day.isCurrentMonth
                      ? "bg-background"
                      : "bg-muted/20 opacity-40"
                  }
                  ${
                    day.isToday
                      ? "ring-2 ring-primary"
                      : ""
                  }
                  ${getPhaseColor(day.phase)}
                  ${day.hasData ? "font-semibold" : ""}
                `}
              >
                <div
                  className={`text-xs font-bold w-full text-left pl-1 ${
                    day.isToday ? "text-primary" : "text-foreground"
                  }`}
                >
                  {day.date.getDate()}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  {day.phase && (
                    <div className="my-1">
                      <PhaseIcon phase={day.phase} />
                    </div>
                  )}

                  {day.cycleDay && (
                    <div className="mt-1 text-[10px] text-muted-foreground font-medium bg-background px-1.5 py-0.5 rounded-full border">
                      Hari {day.cycleDay}
                    </div>
                  )}
                </div>

                {day.hasData && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-start gap-3 mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <Text variant="body-sm" weight="semibold" className="text-blue-900 mb-1">
                  Klik Tanggal untuk Catat Gejala
                </Text>
                <Text variant="label-sm" className="text-muted-foreground">
                  Klik pada tanggal mana saja di kalender untuk membuka
                  halaman pencatatan gejala harian pada tanggal tersebut.
                </Text>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
                <Text variant="body-sm" weight="medium" className="text-foreground">
                  Memiliki data catatan
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary rounded-lg bg-background"></div>
                <Text variant="body-sm" weight="medium" className="text-foreground">
                  Hari ini
                </Text>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Legenda Fase Siklus</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100 hover:border-red-200 transition-colors">
              <div className="w-8 h-8 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center">
                <Droplet className="h-4 w-4 text-red-600" />
              </div>
              <Text variant="body-sm" weight="semibold">
                Sedang Menstruasi
              </Text>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
              <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center">
                <Sprout className="h-4 w-4 text-green-600" />
              </div>
              <Text variant="body-sm" weight="semibold">
                Setelah Menstruasi
              </Text>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors">
              <div className="w-8 h-8 bg-purple-100 border border-purple-200 rounded-lg flex items-center justify-center">
                <Flower2 className="h-4 w-4 text-purple-600" />
              </div>
              <Text variant="body-sm" weight="semibold">
                Masa Subur
              </Text>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
              <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center">
                <Moon className="h-4 w-4 text-blue-600" />
              </div>
              <Text variant="body-sm" weight="semibold">
                Menjelang Menstruasi
              </Text>
            </div>
          </div>

          {/* Phase Explanations */}
          <div className="space-y-4">
            <Heading level={3} size="heading-sm" className="mb-4">
              Penjelasan Fase Siklus
            </Heading>

            <div className="p-4 bg-red-50 rounded-lg border border-red-100 hover:border-red-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="h-5 w-5 text-red-600" />
                <Text variant="body-md" weight="bold" className="text-red-900">
                  Sedang Menstruasi
                </Text>
              </div>
              <Text variant="body-sm" className="text-muted-foreground">
                Anda sedang dalam periode haid. Tubuh mengeluarkan lapisan dinding rahim. Biasanya berlangsung 3-7 hari.
              </Text>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <Text variant="body-md" weight="bold" className="text-green-900">
                  Setelah Menstruasi
                </Text>
              </div>
              <Text variant="body-sm" className="text-muted-foreground">
                Tubuh Anda pulih setelah haid. Energi mulai meningkat dan suasana hati membaik. Ini waktu yang baik untuk aktivitas fisik.
              </Text>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Flower2 className="h-5 w-5 text-purple-600" />
                <Text variant="body-md" weight="bold" className="text-purple-900">
                  Masa Subur
                </Text>
              </div>
              <Text variant="body-sm" className="text-muted-foreground">
                Ini adalah waktu paling subur untuk kehamilan. Jika sedang merencanakan kehamilan, ini waktu yang tepat.
              </Text>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-5 w-5 text-blue-600" />
                <Text variant="body-md" weight="bold" className="text-blue-900">
                  Menjelang Menstruasi
                </Text>
              </div>
              <Text variant="body-sm" className="text-muted-foreground">
                Menunggu haid berikutnya. Anda mungkin mengalami gejala PMS seperti mood swing, kembung, atau sensitif.
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
