import { create } from "zustand";

export interface AirportOption {
  iata: string;
  city: string;
  country: string;
  name: string;
  lat: number;
  lng: number;
}

interface SearchState {
  origin: AirportOption | null;
  destination: AirportOption | null;
  date: string;
  passengers: number;
  classType: string;
  setOrigin: (a: AirportOption | null) => void;
  setDestination: (a: AirportOption | null) => void;
  setDate: (d: string) => void;
  setPassengers: (n: number) => void;
  setClassType: (c: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  origin: null,
  destination: null,
  date: "",
  passengers: 1,
  classType: "economy",
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setDate: (date) => set({ date }),
  setPassengers: (passengers) => set({ passengers }),
  setClassType: (classType) => set({ classType }),
}));
