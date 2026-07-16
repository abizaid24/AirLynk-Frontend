import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PassengerCreatePayload } from "@/types/order";

export interface SelectedSeat {
  seatId: string;
  seatNumber: string;
}

export interface SelectedAncillary {
  type: string;
  quantity: number;
}

interface BookingState {
  flightId: string | null;
  classId: string | null;
  passengerCount: number;
  selectedSeats: SelectedSeat[];
  passengers: PassengerCreatePayload[];
  ancillaries: SelectedAncillary[];
  orderId: string | null;

  startBooking: (flightId: string, classId: string, passengerCount: number) => void;
  toggleSeat: (seat: SelectedSeat) => void;
  setPassengers: (passengers: PassengerCreatePayload[]) => void;
  toggleAncillary: (type: string) => void;
  setOrderId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  flightId: null as string | null,
  classId: null as string | null,
  passengerCount: 1,
  selectedSeats: [] as SelectedSeat[],
  passengers: [] as PassengerCreatePayload[],
  ancillaries: [] as SelectedAncillary[],
  orderId: null as string | null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startBooking: (flightId, classId, passengerCount) =>
        set({
          ...initialState,
          flightId,
          classId,
          passengerCount,
        }),

      toggleSeat: (seat) => {
        const { selectedSeats, passengerCount } = get();
        const exists = selectedSeats.find((s) => s.seatId === seat.seatId);
        if (exists) {
          set({ selectedSeats: selectedSeats.filter((s) => s.seatId !== seat.seatId) });
          return;
        }
        if (selectedSeats.length >= passengerCount) return;
        set({ selectedSeats: [...selectedSeats, seat] });
      },

      setPassengers: (passengers) => set({ passengers }),

      toggleAncillary: (type) => {
        const { ancillaries } = get();
        const exists = ancillaries.find((a) => a.type === type);
        if (exists) {
          set({ ancillaries: ancillaries.filter((a) => a.type !== type) });
        } else {
          set({ ancillaries: [...ancillaries, { type, quantity: 1 }] });
        }
      },

      setOrderId: (orderId) => set({ orderId }),

      reset: () => set(initialState),
    }),
    {
      name: "airlynk-booking",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
