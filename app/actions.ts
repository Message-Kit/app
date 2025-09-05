"use server";

import { REST } from "@discordjs/rest";
import type { RESTGetAPICurrentUserGuildsResult, RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { PermissionFlagsBits, RouteBases, Routes } from "discord-api-types/v10";
import { createClient as createServerClient } from "@/utils/supabase/server";

const clientToken = process.env.DISCORD_CLIENT_TOKEN;

if (!clientToken) {
    throw new Error("DISCORD_CLIENT_TOKEN is not set");
}

export async function fetchDiscordGuilds(): Promise<{
    data: RESTGetAPICurrentUserGuildsResult | null;
    error: string | null;
}> {
    try {
        const supabase = await createServerClient();

        const {
            data: { session },
        } = await supabase.auth.getSession();

        const providerToken = session?.provider_token;

        if (!providerToken) {
            return { data: null, error: "provider token unavailable" };
        }

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

            const filtered = guilds
                .filter((g) => botGuildIds.has(g.id)) // only guilds bot is in
                .filter((g) => {
                    const perms = BigInt(g.permissions);
                    return (perms & PermissionFlagsBits.Administrator) !== BigInt(0);
                });

            return { data: filtered, error: null };
        } catch {
            return { data: guilds, error: null };
        }
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

const rest = new REST({ version: "10" }).setToken(clientToken);

export async function sendMessageToDiscord(messageBody: RESTPostAPIChannelMessageJSONBody, channelId: string) {
    return await rest.post(Routes.channelMessages(channelId), {
        body: messageBody,
    });
}
