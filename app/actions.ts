"use server";

import { REST } from "@discordjs/rest";
import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { RouteBases, Routes } from "discord-api-types/v10";
import { createClient as createServerClient } from "@/utils/supabase/server";

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

        const clientToken = process.env.DISCORD_CLIENT_TOKEN;
        if (!clientToken) {
            return { data: guilds, error: null };
        }

        try {
            const rest = new REST({ version: "10" }).setToken(clientToken);
            const results = await Promise.allSettled(
                guilds.map(async (guild) => {
                    const url = `${Routes.guild(guild.id)}?${new URLSearchParams({ with_counts: "true" })}`;
                    await rest.get(url as `/guilds/${string}`);

                    return guild.id;
                }),
            );

            const botGuildIds = new Set(
                results
                    .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
                    .map((r) => r.value),
            );

            const filtered = guilds.filter((g) => botGuildIds.has(g.id));
            return { data: filtered, error: null };
        } catch {
            return { data: guilds, error: null };
        }
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function getDiscordProviderToken(): Promise<{
    token: string | null;
    error: string | null;
}> {
    try {
        const supabase = await createServerClient();

        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            return { token: null, error: error.message };
        }

        if (session?.provider_token) {
            return { token: session.provider_token, error: null };
        }

        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError) {
            return { token: null, error: refreshError.message };
        }

        const providerToken = refreshed.session?.provider_token ?? null;
        return {
            token: providerToken,
            error: providerToken ? null : "provider token unavailable",
        };
    } catch (e) {
        return { token: null, error: (e as Error).message };
    }
}
