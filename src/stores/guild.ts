import { create } from "zustand";

interface GuildStore {
    guildId: string | null;
    setGuildId: (id: string | null) => void;
}

const GUILD_ID_KEY = "selectedGuildId";

export const useGuildStore = create<GuildStore>((set) => ({
    guildId:
        typeof window !== "undefined"
            ? localStorage.getItem(GUILD_ID_KEY)
            : null,
    setGuildId: (id) => {
        if (typeof window !== "undefined") {
            if (id) {
                localStorage.setItem(GUILD_ID_KEY, id);
            } else {
                localStorage.removeItem(GUILD_ID_KEY);
            }
        }
        set({ guildId: id });
    },
}));
