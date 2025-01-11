// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

// src/stores/useAuthStore.ts
export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        login: async (email: string, password: string) => {
            try {
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });
          
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.error || 'Failed to login');
              }
          
              const user = data.user as User;
              set({ user });
              return user;  // Return the user object to satisfy the type
            } catch (error) {
              if (error instanceof Error) {
                throw new Error(error.message);
              }
              throw new Error('An unknown error occurred');
            }
          },
        logout: () => {
          set({ user: null });
          window.location.href = '/login';
        },
      }),
      {
        name: 'auth-storage',
        storage: typeof window !== 'undefined' 
          ? createJSONStorage(() => localStorage)
          : undefined
      }
    )
  );