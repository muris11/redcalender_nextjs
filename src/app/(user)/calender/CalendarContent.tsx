"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/ui/loading";
import { useAuthStore } from "@/store/authStore";
import { ChevronLeft, ChevronRight, Clock, Heart, Plus } from "lucide-react";
import Link from "next/link";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);
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
    console.log("Calendar: Auth state changed", {
      isLoading,
      isAuthenticated,
      userId: user?.id,
    });

    // Wait until auth state has initialized
    if (isLoading) {
      console.log("Calendar: Waiting for auth to initialize...");
      return;
    }

    if (!isAuthenticated) {
      console.log("Calendar: Not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    if (!user?.id) {
      console.error("Calendar: User ID not found");
      setIsDataLoading(false);
      return;
    }

    console.log(
      "Calendar: Loading calendar data for month:",
      currentDate.toLocaleDateString("id-ID")
    );
    loadCalendarData(currentDate);
  }, [isAuthenticated, isLoading, router, currentDate, user?.id]);

  const loadCalendarData = async (date: Date) => {
    if (!user?.id) {
      console.error("Calendar: Cannot load data - no user ID");
      setIsDataLoading(false);
      return;
    }

    try {
      setIsDataLoading(true);
      const apiUrl = `/api/user/calendar?userId=${
        user.id
      }&year=${date.getFullYear()}&month=${date.getMonth()}`;
      console.log("Calendar: Fetching from", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Calendar API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch calendar data");
      }

      const data = await response.json();
      console.log("Calendar API response:", data);

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

        console.log(`Calendar: Loaded ${transformedDays.length} days`);
        setCalendarDays(transformedDays);
      } else {
        console.warn("Calendar: No calendarData in response, using fallback");
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
    console.log("Calendar: Generating basic calendar fallback");
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

    console.log(`Calendar: Generated ${days.length} basic calendar days`);
    setCalendarDays(days);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (day.isCurrentMonth) {
      setShowLogForm(true);
    }
  };

  const getPhaseColor = (phase?: string) => {
    switch (phase) {
      case "menstrual":
        return "bg-red-100 border-red-200";
      case "follicular":
        return "bg-green-100 border-green-200";
      case "ovulation":
        return "bg-purple-100 border-purple-200";
      case "luteal":
        return "bg-blue-100 border-blue-200";
      default:
        return "hover:bg-gray-100 border-transparent";
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

  // Show auth loading
  if (isLoading) {
    console.log("Calendar: Rendering auth loading state");
    return <PageLoading text="Memuat autentikasi..." />;
  }

  if (!isAuthenticated) {
    console.log("Calendar: Not authenticated, showing nothing (will redirect)");
    return null; // Will redirect
  }

  if (isDataLoading) {
    console.log("Calendar: Rendering data loading state");
    return <PageLoading text="Memuat kalender..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month Navigation */}
        <Card className="mb-8 border-0 shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-purple-500 to-pink-500 p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateMonth(-1)}
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <CardTitle className="text-3xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>

              <Button
                variant="outline"
                onClick={() => navigateMonth(1)}
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-bold text-gray-700 uppercase tracking-wide"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative p-4 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-lg h-28 flex flex-col items-start justify-between
                    ${day.isCurrentMonth ? "bg-white" : "bg-gray-50 opacity-40"}
                    ${day.isToday ? "ring-4 ring-pink-400 ring-offset-2" : ""}
                    ${getPhaseColor(day.phase)}
                    ${day.hasData ? "font-bold shadow-md" : ""}
                  `}
                >
                  <div
                    className={`text-base font-bold ${
                      day.isToday ? "text-pink-600" : ""
                    }`}
                  >
                    {day.date.getDate()}
                  </div>

                  {day.phase && (
                    <div className="text-2xl self-center">
                      {getPhaseIcon(day.phase)}
                    </div>
                  )}

                  {day.cycleDay && (
                    <div className="text-[11px] self-end text-gray-600 font-medium bg-white/70 px-2 py-0.5 rounded-full">
                      D{day.cycleDay}
                    </div>
                  )}

                  {day.hasData && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 rounded-full shadow-sm"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl flex items-center">
              <span className="mr-2">🎨</span> Legenda Fase Siklus
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl border border-red-200">
                <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center text-lg">
                  🩸
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Menstruasi
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center text-lg">
                  🌱
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Folikuler
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-6 h-6 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center text-lg">
                  🌸
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Ovulasi
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center text-lg">
                  🌙
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Luteal
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-pink-500 rounded-full shadow-sm"></div>
                <span className="text-sm font-medium text-gray-700">
                  Memiliki data catatan
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-4 border-pink-400 rounded-lg"></div>
                <span className="text-sm font-medium text-gray-700">
                  Hari ini
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            onClick={() => setShowLogForm(true)}
            className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 px-6 py-6 text-base"
          >
            <Plus className="h-5 w-5 mr-2" />
            Catat Gejala Hari Ini
          </Button>

          <Button
            asChild
            className="bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 px-6 py-6 text-base"
          >
            <Link href="/analysis">
              <Clock className="h-5 w-5 mr-2" />
              Lihat Analisis Siklus
            </Link>
          </Button>
        </div>
      </main>

      {/* Log Form Modal */}
      {showLogForm && selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <CardHeader className="bg-linear-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-xl">
                Catat Data untuk{" "}
                {selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <p className="text-gray-600 text-lg mb-6">
                  Form pencatatan gejala dan mood akan segera tersedia. Fitur
                  ini sedang dalam pengembangan.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLogForm(false)}
                  className="px-6"
                >
                  Tutup
                </Button>
                <Button
                  asChild
                  className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 px-6"
                >
                  <Link href="/log">Buka Form Lengkap</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
