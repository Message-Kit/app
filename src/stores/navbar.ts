import { create } from "zustand";

interface NavbarState {
    heading: string | null;
    setHeading: (heading: string | null) => void;
}

export const useNavbar = create<NavbarState>((set) => ({
    heading: "",
    setHeading: (heading) => set({ heading }),
}));
