"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthInit() {
  useEffect(() => {
    // Initialize the auth state from localStorage once on the client
    useAuthStore.getState().initialize();
  }, []);

  return null;
}
