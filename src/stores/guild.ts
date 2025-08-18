import { create } from "zustand";

export interface Guild {
    banner: string;
    features: string[];
    icon: string;
    id: string;
    name: string;
    owner: boolean;
    permissions: number;
    permissions_new: string;
}

interface GuildStore {
    selectedGuild: Guild | null;
    setSelectedGuild: (guild: Guild | null) => void;
}

export const useGuildStore = create<GuildStore>((set) => ({
    selectedGuild: null,
    setSelectedGuild: (guild) => set({ selectedGuild: guild }),
}));
