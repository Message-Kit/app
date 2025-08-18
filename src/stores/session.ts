import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";

type SessionState = {
    session: Session | null;
    setSession: (session: Session | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
    session: null,
    setSession: (session) => set({ session }),
}));
