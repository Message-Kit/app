import { create } from "zustand";
import { User } from "@supabase/supabase-js";

type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
