import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesStore {
  ids: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],

      addFavorite: (id) => {
        if (get().ids.includes(id)) return; // sin duplicados
        set((state) => ({ ids: [...state.ids, id] }));
      },

      removeFavorite: (id) =>
        set((state) => ({ ids: state.ids.filter((i) => i !== id) })),

      clearFavorites: () => set({ ids: [] }),
    }),
    {
      name: 'casa-musical-favorites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);