"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UnifiedPageLoading } from "@/components/ui/loading-skeletons";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Stop loading when pathname changes (navigation complete)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // Safety timeout - stop loading after 5 seconds max
  useEffect(() => {
    if (!isLoading) return;
    
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <UnifiedPageLoading />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
