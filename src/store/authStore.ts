import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  password: string;
  role: 'USER' | 'ADMIN';
  avgCycleLength: number;
  avgPeriodLength: number;
  theme?: string;
  isOnboarded: boolean;
  menstrualStatus?: string;
  lastPeriodDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
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
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        // Simpan ke localStorage
        localStorage.setItem('redcalendar_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Terjadi kesalahan koneksi' };
    }
  },

  register: async (userData: RegisterData) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        // Simpan ke localStorage
        localStorage.setItem('redcalendar_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Terjadi kesalahan koneksi' };
    }
  },

  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
    localStorage.removeItem('redcalendar_user');
  },

  setUser: (user: User) => {
    set({ 
      user, 
      isAuthenticated: true 
    });
  },
}));

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('redcalendar_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.id && user.email) {
        useAuthStore.getState().setUser(user);
      } else {
        localStorage.removeItem('redcalendar_user');
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('redcalendar_user');
    }
  }
}