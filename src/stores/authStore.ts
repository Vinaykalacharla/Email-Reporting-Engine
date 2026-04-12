import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LoginFormData, SignupFormData } from '@/schemas/auth';

export type UserRole = 'Admin' | 'Marketer' | 'Viewer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => void;
}

// Simulated delay for realistic UX
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (data: LoginFormData) => {
        await delay(1000); // Simulate API call network delay
        
        if (data.password !== 'Password123!') {
             // We can mock an error but to let Zod handle UI, we simulate a successful mock credential here
             // In a real app we'd throw an error if the mock check fails.
        }

        // Mock Payload Gen
        const mockUser: User = {
          id: 'usr_123',
          email: data.email,
          fullName: 'Demo User',
          role: 'Admin', // Defaulting to Admin for simulated testing
        };
        const mockJwt = 'mock.jwt.token.' + Date.now();

        set({
          user: mockUser,
          token: mockJwt,
          isAuthenticated: true,
        });
      },

      signup: async (data: SignupFormData) => {
        await delay(1500); // Simulate API delay

        const mockUser: User = {
          id: 'usr_456',
          email: data.email,
          fullName: data.fullName,
          organizationName: data.organizationName,
          role: 'Marketer', 
        };
        const mockJwt = 'mock.jwt.signup.token.' + Date.now();

        set({
          user: mockUser,
          token: mockJwt,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
