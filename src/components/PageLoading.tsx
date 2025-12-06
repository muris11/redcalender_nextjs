"use client";

import { Loading } from "@/components/ui/loading";

interface PageLoadingProps {
  text: string;
}

export default function PageLoading({ text }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Loading size="lg" text="" />
        </div>
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          {text}
        </div>
      </div>
    </div>
  );
}
