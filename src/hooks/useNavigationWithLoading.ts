"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { useCallback } from "react";

export function useNavigationWithLoading() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const navigateTo = useCallback((href: string) => {
    startLoading();
    
    // Set timeout untuk safety - stop loading jika terlalu lama
    const timeoutId = setTimeout(() => {
      stopLoading();
    }, 5000); // 5 detik max
    
    // Navigate
    router.push(href);
    
    // Stop loading setelah sedikit delay (simulasi transition)
    setTimeout(() => {
      clearTimeout(timeoutId);
      stopLoading();
    }, 300);
  }, [router, startLoading, stopLoading]);

  return { navigateTo };
}
