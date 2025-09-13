import { create } from "zustand";

interface ShouldInspectStore {
    shouldInspect: boolean;
    setShouldInspect: (value: boolean) => void;
}

export const useShouldInspectStore = create<ShouldInspectStore>((set) => ({
    shouldInspect: false,
    setShouldInspect: (value) => set({ shouldInspect: value }),
}));
