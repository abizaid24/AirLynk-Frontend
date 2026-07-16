import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ConciergeMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConciergeState {
  sessionId: string | null;
  messages: ConciergeMessage[];
  isOpen: boolean;
  setSessionId: (id: string) => void;
  addMessage: (message: ConciergeMessage) => void;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

export const useConciergeStore = create<ConciergeState>()(
  persist(
    (set) => ({
      sessionId: null,
      messages: [],
      isOpen: false,
      setSessionId: (sessionId) => set({ sessionId }),
      addMessage: (message) =>
        set((s) => ({ messages: [...s.messages, message] })),
      setOpen: (isOpen) => set({ isOpen }),
      reset: () => set({ sessionId: null, messages: [] }),
    }),
    {
      name: "airlynk-concierge",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ sessionId: s.sessionId, messages: s.messages }),
    }
  )
);
