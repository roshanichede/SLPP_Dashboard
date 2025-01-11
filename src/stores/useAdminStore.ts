// src/stores/useAdminStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  threshold: number;
  setThreshold: (threshold: number) => Promise<void>;
  respondToPetition: (petitionId: string, response: string) => Promise<void>;
  error: string | null;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      threshold: 1000,
      error: null,

      setThreshold: async (threshold: number) => {
        try {
          const response = await fetch('/api/admin/threshold', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ threshold }),
          });

          if (!response.ok) {
            throw new Error('Failed to update threshold');
          }

          set({ threshold });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
      },

      respondToPetition: async (petitionId: string, response: string) => {
        try {
          const apiResponse = await fetch('/api/admin/respond', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ petitionId, response }),
          });

          if (!apiResponse.ok) {
            throw new Error('Failed to respond to petition');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);