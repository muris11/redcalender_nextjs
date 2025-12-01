'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasData: boolean;
  phase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  cycleDay?: number;
}

export default function CalendarPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    generateCalendarDays();
  }, [isAuthenticated, router, currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday of the week containing first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End on Saturday of the week containing last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Simulate cycle data (nanti akan diambil dari API)
    const lastPeriod = new Date(today);
    lastPeriod.setDate(today.getDate() - 15);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const dayDiff = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
      
      let phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | undefined;
      let cycleDay = dayDiff + 1;
      
      if (dayDiff >= 0 && dayDiff < 7) {
        phase = 'menstrual';
      } else if (dayDiff >= 7 && dayDiff < 12) {
        phase = 'follicular';
      } else if (dayDiff >= 12 && dayDiff <= 16) {
        phase = 'ovulation';
      } else if (dayDiff > 16 && dayDiff < 28) {
        phase = 'luteal';
      }
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        hasData: Math.random() > 0.7, // Simulate random data
        phase,
        cycleDay: cycleDay > 0 && cycleDay <= 28 ? cycleDay : undefined
      });
    }
    
    setCalendarDays(days);
  };

  const getPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-100 text-red-700 border-red-300';
      case 'follicular': return 'bg-green-100 text-green-700 border-green-300';
      case 'ovulation': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'luteal': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPhaseIcon = (phase?: string) => {
    switch (phase) {
      case 'menstrual': return '🩸';
      case 'ovulation': return '🌸';
      case 'follicular': return '🌱';
      case 'luteal': return '🌙';
      default: return '';
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setShowLogForm(true);
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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
              <h1 className="text-xl font-semibold text-gray-900">Kalender Siklus</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hai, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <CardTitle className="text-2xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              
              <Button 
                variant="outline" 
                onClick={() => navigateMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600">
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
                    relative p-3 rounded-lg border-2 transition-all hover:scale-105
                    ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-50'}
                    ${day.isToday ? 'ring-2 ring-pink-500' : ''}
                    ${getPhaseColor(day.phase)}
                    ${day.hasData ? 'font-semibold' : ''}
                  `}
                >
                  <div className="text-sm">
                    {day.date.getDate()}
                  </div>
                  
                  {day.phase && (
                    <div className="text-xs mt-1">
                      {getPhaseIcon(day.phase)}
                    </div>
                  )}
                  
                  {day.cycleDay && (
                    <div className="text-xs mt-1">
                      {day.cycleDay}
                    </div>
                  )}
                  
                  {day.hasData && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legenda Fase Siklus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm">🩸 Menstruasi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm">🌱 Folikuler</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                <span className="text-sm">🌸 Ovulasi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm">🌙 Luteal</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-sm">Memiliki data catatan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-pink-500 rounded"></div>
                <span className="text-sm">Hari ini</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button 
            onClick={() => setShowLogForm(true)}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Catat Gejala Hari Ini
          </Button>
          
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Lihat Analisis Siklus
          </Button>
        </div>
      </main>

      {/* Log Form Modal */}
      {showLogForm && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                Catat Data untuk {selectedDate.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Form pencatatan gejala dan mood akan segera tersedia. 
                Fitur ini sedang dalam pengembangan.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowLogForm(false)}>
                  Tutup
                </Button>
                <Button asChild>
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