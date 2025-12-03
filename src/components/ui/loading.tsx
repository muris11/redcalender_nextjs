import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({
  className,
  size = "md",
  text = "Memuat...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        className
      )}
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            "animate-spin rounded-full border-4 border-pink-200 border-t-pink-600",
            sizeClasses[size]
          )}
        />
        {/* Inner pulse */}
        <div
          className={cn(
            "absolute inset-0 animate-pulse rounded-full bg-pink-100 opacity-50",
            sizeClasses[size]
          )}
        />
      </div>
      {text && (
        <p
          className={cn(
            "text-gray-600 font-medium animate-pulse",
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoading({ text = "Memuat halaman..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

export function CardLoading({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loading size="md" text={text} />
    </div>
  );
}
