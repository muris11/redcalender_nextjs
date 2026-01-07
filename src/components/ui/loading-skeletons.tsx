import { Skeleton } from "@/components/ui/skeleton";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

// --- Unified Page Loading ---
export function UnifiedPageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner */}
        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        
        {/* Text */}
        <div className="text-center">
          <Heading level="3" size="heading-sm">Red Calender</Heading>
          <Text variant="body-sm" className="text-muted-foreground mt-1">
            Memuat...
          </Text>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard Skeleton ---
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4 md:w-1/2 bg-gray-200" />
        <Skeleton className="h-5 w-1/2 md:w-1/3 bg-gray-100" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-gray-100" />
        ))}
      </div>

      {/* Current Cycle Progress */}
      <Skeleton className="h-48 rounded-xl bg-gray-100" />

      {/* Recent Cycles & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl bg-gray-100" />
        <Skeleton className="h-64 rounded-xl bg-gray-100" />
      </div>

      {/* Health Metrics */}
      <Skeleton className="h-40 rounded-xl bg-gray-100" />
    </div>
  );
}

// --- Calendar Skeleton ---
export function CalendarSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <Skeleton className="h-20 w-full rounded-xl bg-gray-100" />
      
      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <Skeleton key={i} className="h-20 md:h-24 rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

// --- Article Card Skeleton ---
export function ArticleCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Chart Skeleton ---
export function ChartSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl bg-gray-100" />
        <Skeleton className="h-80 rounded-xl bg-gray-100" />
      </div>
      <Skeleton className="h-64 rounded-xl bg-gray-100" />
    </div>
  );
}

// --- Profile Skeleton ---
export function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-24 w-24 rounded-full bg-gray-200" />
        <Skeleton className="h-8 w-48 bg-gray-200" />
        <Skeleton className="h-4 w-32 bg-gray-100" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-lg bg-gray-100" />
        <Skeleton className="h-12 w-full rounded-lg bg-gray-100" />
        <Skeleton className="h-12 w-full rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

// --- Log Skeleton ---
export function LogSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Skeleton className="h-16 w-full rounded-xl bg-gray-100" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
    </div>
  );
}
