import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import AsyncStorage from '@react-native-async-storage/async-storage';

type TripStore = {
  tripIds: string[];

  actions: {
    addTrip: (tripId: string) => void;
    removeTrip: (tripId: string) => void;
    clearTrips: () => void;
  };
};

const useTripStore = create(
  persist(
    immer<TripStore>((set) => ({
      tripIds: [],
      actions: {
        addTrip: (tripId) =>
          set((state) => {
            state.tripIds.push(tripId);
          }),
        removeTrip: (tripId) =>
          set((state) => {
            state.tripIds = state.tripIds.filter((id) => id !== tripId);
          }),
        clearTrips: () =>
          set((state) => {
            state.tripIds = [];
          }),
      },
    })),
    {
      name: '@planner/tripIds',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ tripIds: state.tripIds }),
    },
  ),
);

export const useTripIds = () => useTripStore.getState().tripIds;
export const useTripActions = () => useTripStore.getState().actions;
