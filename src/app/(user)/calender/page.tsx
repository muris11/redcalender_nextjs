"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarSkeleton, UnifiedPageLoading } from "@/components/ui/loading-skeletons";
import { useAuthStore } from "@/store/authStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        return "bg-red-50/80 border-red-200 hover:bg-red-100";
      case "follicular":
        return "bg-green-50/80 border-green-200 hover:bg-green-100";
      case "ovulation":
        return "bg-purple-50/80 border-purple-200 hover:bg-purple-100";
      case "luteal":
        return "bg-blue-50/80 border-blue-200 hover:bg-blue-100";
      default:
        return "hover:bg-gray-50 border-transparent";
    }
  };

  const getPhaseIcon = (phase?: string) => {
    switch (phase) {
      case "menstrual":
        return "🩸";
      case "follicular":
        return "🌱";
      case "ovulation":
        return "🌸";
      case "luteal":
        return "🌙";
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <CalendarSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Month Navigation */}
        <Card className="mb-6 md:mb-8 border-0 shadow-lg overflow-hidden glass-card">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateMonth(-1)}
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white transition-all duration-200 p-2 md:p-3 h-auto"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center px-2">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>

              <Button
                variant="outline"
                onClick={() => navigateMonth(1)}
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white transition-all duration-200 p-2 md:p-3 h-auto"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card className="mb-6 md:mb-8 border-0 shadow-lg glass-card">
          <CardContent className="p-2 md:p-4 lg:p-6">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-2 md:mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] md:text-xs lg:text-sm font-bold text-gray-600 uppercase tracking-wide py-1 md:py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative p-1 md:p-2 rounded-lg md:rounded-xl border transition-all hover:scale-105 hover:shadow-md min-h-12 md:min-h-16 lg:min-h-20 flex flex-col items-center justify-start cursor-pointer
                    ${
                      day.isCurrentMonth
                        ? "bg-white/60 backdrop-blur-sm"
                        : "bg-gray-50/30 opacity-40"
                    }
                    ${
                      day.isToday
                        ? "ring-2 ring-pink-400 ring-offset-2"
                        : ""
                    }
                    ${getPhaseColor(day.phase)}
                    ${day.hasData ? "font-bold shadow-sm" : ""}
                  `}
                >
                  <div
                    className={`text-xs md:text-sm font-bold w-full text-left pl-1 ${
                      day.isToday ? "text-pink-600" : "text-gray-700"
                    }`}
                  >
                    {day.date.getDate()}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {day.phase && (
                      <div className="text-sm md:text-lg lg:text-xl animate-in zoom-in duration-300">
                        {getPhaseIcon(day.phase)}
                      </div>
                    )}

                    {day.cycleDay && (
                      <div className="mt-1 text-[8px] md:text-[10px] text-gray-600 font-medium bg-white/80 px-1.5 py-0.5 rounded-full shadow-sm">
                        Hari {day.cycleDay}
                      </div>
                    )}
                  </div>

                  {day.hasData && (
                    <div className="absolute top-1 right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-pink-500 rounded-full shadow-sm ring-1 ring-white"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-start space-x-3 mb-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <div className="w-5 h-5 text-blue-600 mt-0.5">👆</div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    Klik Tanggal untuk Catat Gejala
                  </p>
                  <p className="text-xs text-blue-700">
                    Klik pada tanggal mana saja di kalender untuk membuka
                    halaman pencatatan gejala harian pada tanggal tersebut.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-pink-500 rounded-full shadow-sm ring-1 ring-pink-200"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Memiliki data catatan
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-pink-400 rounded-lg bg-white"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Hari ini
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-0 shadow-lg glass-card">
          <CardHeader className="bg-gray-50/50 px-4 py-4 md:px-6 md:py-6 border-b border-gray-100">
            <CardTitle className="text-lg md:text-xl flex items-center">
              <span className="mr-2">🎨</span> Legenda Fase Siklus
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                <div className="w-8 h-8 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center text-lg shadow-sm">
                  🩸
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Sedang Menstruasi
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-xl border border-green-100 hover:bg-green-50 transition-colors">
                <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center text-lg shadow-sm">
                  🌱
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Setelah Menstruasi
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100 hover:bg-purple-50 transition-colors">
                <div className="w-8 h-8 bg-purple-100 border border-purple-200 rounded-lg flex items-center justify-center text-lg shadow-sm">
                  🌸
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Masa Subur
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center text-lg shadow-sm">
                  🌙
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Menjelang Menstruasi
                </span>
              </div>
            </div>

            {/* Phase Explanations */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Penjelasan Fase Siklus
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-red-50/30 rounded-xl border border-red-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🩸</span>
                    <h4 className="font-bold text-red-800">Sedang Menstruasi</h4>
                  </div>
                  <p className="text-sm text-red-700/80 leading-relaxed">
                    Anda sedang dalam periode haid. Tubuh mengeluarkan lapisan dinding rahim. Biasanya berlangsung 3-7 hari.
                  </p>
                </div>

                <div className="p-4 bg-green-50/30 rounded-xl border border-green-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🌱</span>
                    <h4 className="font-bold text-green-800">Setelah Menstruasi</h4>
                  </div>
                  <p className="text-sm text-green-700/80 leading-relaxed">
                    Tubuh Anda pulih setelah haid. Energi mulai meningkat dan suasana hati membaik. Ini waktu yang baik untuk aktivitas fisik.
                  </p>
                </div>

                <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🌸</span>
                    <h4 className="font-bold text-purple-800">Masa Subur</h4>
                  </div>
                  <p className="text-sm text-purple-700/80 leading-relaxed">
                    Ini adalah waktu paling subur untuk kehamilan. Jika sedang merencanakan kehamilan, ini waktu yang tepat.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🌙</span>
                    <h4 className="font-bold text-blue-800">Menjelang Menstruasi</h4>
                  </div>
                  <p className="text-sm text-blue-700/80 leading-relaxed">
                    Menunggu haid berikutnya. Anda mungkin mengalami gejala PMS seperti mood swing, kembung, atau sensitif.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
