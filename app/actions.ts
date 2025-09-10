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

        let providerToken = session?.provider_token;
        const providerRefreshToken = session?.provider_refresh_token;

        const exchangeRefreshToken = async (refreshToken: string) => {
            const clientId = process.env.DISCORD_CLIENT_ID;
            const clientSecret = process.env.DISCORD_CLIENT_SECRET;
            if (!clientId || !clientSecret) throw new Error("missing discord client id/secret");

            const res = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`discord token refresh failed ${res.status}: ${txt}`);
            }

            const json = await res.json();
            // json.access_token, json.refresh_token (may exist), json.expires_in
            return json as { access_token: string; refresh_token?: string; expires_in?: number };
        };

        const tryFetchGuildsWithToken = async (token: string) => {
            const response = await fetch(RouteBases.api + Routes.userGuilds(), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });

            if (!response.ok) {
                const errorText = await response.text();
                const status = response.status;
                return { ok: false, status, errorText, json: null as RESTGetAPICurrentUserGuildsResult | null };
            }

            const guilds = (await response.json()) as RESTGetAPICurrentUserGuildsResult;
            return { ok: true, status: 200, errorText: null, json: guilds };
        };

        // If we don't have a provider token, try to refresh it right away (if refresh token exists)
        if (!providerToken && providerRefreshToken) {
            try {
                const refreshed = await exchangeRefreshToken(providerRefreshToken);
                providerToken = refreshed.access_token;
                // NOTE: Discord may return a new refresh_token; if you want persistence, save refreshed.refresh_token somewhere.
            } catch (err) {
                return { data: null, error: (err as Error).message };
            }
        }

        if (!providerToken) {
            return { data: null, error: "provider token unavailable" };
        }

        // First attempt to fetch guilds
        let attempt = await tryFetchGuildsWithToken(providerToken);

        // If unauthorized, try refreshing once (if refresh token exists)
        if (!attempt.ok && (attempt.status === 401 || attempt.status === 403) && providerRefreshToken) {
            try {
                const refreshed = await exchangeRefreshToken(providerRefreshToken);
                providerToken = refreshed.access_token;
                // Again: consider persisting refreshed.refresh_token if present
                attempt = await tryFetchGuildsWithToken(providerToken);
            } catch (err) {
                return { data: null, error: (err as Error).message };
            }
        }

        if (!attempt.ok) {
            return { data: null, error: `discord error ${attempt.status}: ${attempt.errorText}` };
        }

        const guilds = attempt.json as RESTGetAPICurrentUserGuildsResult;

        const clientToken = process.env.DISCORD_CLIENT_TOKEN;
        if (!clientToken) {
            return { data: guilds, error: null };
        }

        try {
            const rest = new REST({ version: "10" }).setToken(clientToken);
            const results = await Promise.allSettled(
                guilds.map(async (guild) => {
                    await rest.get(Routes.guild(guild.id));
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

type UploadFile = { name: string; mimeType: string; dataBase64: string };

export async function sendMessageToChannel(
    messageBody: RESTPostAPIChannelMessageJSONBody,
    channelId: string,
    files?: UploadFile[],
) {
    if (files && files.length > 0) {
        const form = new FormData();
        form.append("payload_json", JSON.stringify(messageBody));
        files.forEach((file, i) => {
            const buffer = Buffer.from(file.dataBase64, "base64");
            form.append(`files[${i}]`, new Blob([buffer], { type: file.mimeType }), file.name);
        });
        return await rest.post(Routes.channelMessages(channelId), {
            body: form,
        });
    }
    return await rest.post(Routes.channelMessages(channelId), {
        body: messageBody,
    });
}

export async function sendMessageToWebhook(
    messageBody: RESTPostAPIChannelMessageJSONBody,
    webhookUrl: string,
    files?: UploadFile[],
) {
    const url = new URL(webhookUrl);
    url.searchParams.set("with_components", "true");

    const hasFiles = files && files.length > 0;
    const res = await fetch(url.toString(), {
        method: "POST",
        headers: hasFiles ? undefined : { "Content-Type": "application/json" },
        body: hasFiles
            ? (() => {
                  const form = new FormData();
                  form.append("payload_json", JSON.stringify(messageBody));
                  (files ?? []).forEach((file, i) => {
                      const buffer = Buffer.from(file.dataBase64, "base64");
                      form.append(`files[${i}]`, new Blob([buffer], { type: file.mimeType }), file.name);
                  });
                  return form;
              })()
            : JSON.stringify(messageBody),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to send message: ${res.status} ${text}`);
    }

    return true;
}
