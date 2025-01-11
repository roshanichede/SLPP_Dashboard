// src/stores/usePetitionStore.ts
import { create } from 'zustand';
import { useAuthStore, User } from '@/stores/useAuthStore';

export interface Petition {
  id: string;
  title: string;
  content: string;
  status: 'open' | 'closed';
  signature_count: number;
  response?: string;
  petitioner: {
    email: string;
    full_name: string;
  };
}

interface PetitionState {
  petitions: Petition[];
  isLoading: boolean;
  error: string | null;
  fetchPetitions: () => Promise<void>;
  createPetition: (title: string, content: string) => Promise<void>;
  signPetition: (petitionId: string) => Promise<void>;
}

export const usePetitionStore = create<PetitionState>()((set, get) => ({
  petitions: [],
  isLoading: false,
  error: null,

  fetchPetitions: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user as User;
      const response = await fetch('/api/petitions/list', {
        headers: {
          'Authorization': JSON.stringify(user)
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch petitions');
      }
      
      const data = await response.json();
      set({ petitions: data.petitions });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  createPetition: async (title: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user as User;
      const response = await fetch('/api/petitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.stringify(user)
        },
        body: JSON.stringify({ title, content })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to create petition');
      }

      await get().fetchPetitions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  signPetition: async (petitionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user as User;
      const response = await fetch('/api/petitions/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.stringify(user)
        },
        body: JSON.stringify({ petitionId })
      });

      if (!response.ok) {
        throw new Error('Failed to sign petition');
      }

      await get().fetchPetitions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      set({ isLoading: false });
    }
  }
}));