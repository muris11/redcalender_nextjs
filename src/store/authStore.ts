import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  password: string;
  role: "USER" | "ADMIN";
  avgCycleLength: number;
  avgPeriodLength: number;
  theme?: string;
  isOnboarded: boolean;
  menstrualStatus?: string;
  currentlyMenstruating?: string;
  lastPeriodDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized?: boolean;
  initialize: () => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; redirectUrl?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  birthYear?: number;
  avgCycleLength?: number;
  avgPeriodLength?: number;
  theme?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  initialized: false,

  initialize: () => {
    // Ensure initialization happens only once per client session
    try {
      const current = get();
      if (current.initialized) {
        return;
      }
    } catch (err) {
      // Ignore - fallback to performing init
    }

    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("redcalendar_user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user && user.id && user.email) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              initialized: true,
            });
          } else {
            localStorage.removeItem("redcalendar_user");
            set({ isLoading: false, initialized: true });
          }
        } catch (error) {
          localStorage.removeItem("redcalendar_user");
          set({ isLoading: false, initialized: true });
        }
      } else {
        set({ isLoading: false, initialized: true });
      }
    } else {
      set({ isLoading: false, initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem("redcalendar_user", JSON.stringify(data.user));
        return { success: true, redirectUrl: data.redirectUrl };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: "Terjadi kesalahan koneksi" };
    }
  },

  register: async (userData: RegisterData) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        // Simpan ke localStorage
        localStorage.setItem("redcalendar_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Registration error:", error);
      set({ isLoading: false });
      return { success: false, error: "Terjadi kesalahan koneksi" };
    }
  },

  logout: () => {
    // Call logout API to clear HTTP-only cookie
    fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(console.error);
    
    set({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("redcalendar_user");
  },

  setUser: (user: User) => {
    set({
      user,
      isAuthenticated: true,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("redcalendar_user", JSON.stringify(user));
    }
  },
}));
