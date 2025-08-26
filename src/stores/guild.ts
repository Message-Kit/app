import { create } from "zustand";
import { Guild } from "../types/discord";

interface GuildStore {
    guild: Guild | null;
    setGuild: (guild: Guild | null) => void;
}

const GUILD_ID_KEY = "selectedGuildId";

export const useGuildStore = create<GuildStore>((set) => ({
    guild: null,
    setGuild: (guild) => {
        if (typeof window !== "undefined") {
            if (guild?.id) {
                localStorage.setItem(GUILD_ID_KEY, guild.id);
            } else {
                localStorage.removeItem(GUILD_ID_KEY);
            }
        }
        set({ guild });
    },
}));
