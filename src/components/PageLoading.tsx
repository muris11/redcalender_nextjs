"use client";

import { Heart } from "lucide-react";

interface PageLoadingProps {
  text?: string;
}

export default function PageLoading({ text = "Memuat pengalaman Anda..." }: PageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-pink-200 opacity-75 duration-1000" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl">
            <Heart className="h-10 w-10 animate-pulse text-white" fill="currentColor" />
          </div>
        </div>
        
        {/* Text with gradient */}
        <h2 className="animate-pulse text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Red Calendar
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
}
