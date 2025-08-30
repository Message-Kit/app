"use server";

import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { RouteBases, Routes } from "discord-api-types/v10";

export async function fetchDiscordGuilds(providerToken: string): Promise<{
    data: RESTGetAPICurrentUserGuildsResult | null;
    error: string | null;
}> {
    try {
        const response = await fetch(RouteBases.api + Routes.userGuilds(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${providerToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                data: null,
                error: `discord error ${response.status}: ${errorText}`,
            };
        }

        const guilds = (await response.json()) as RESTGetAPICurrentUserGuildsResult;
        return { data: guilds, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}
