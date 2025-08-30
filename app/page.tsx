"use client";

import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/stores/user-store";
import { createClient } from "@/utils/supabase/client";
import { fetchDiscordGuilds } from "./actions";
import { LoginButton } from "./components/auth";

export default function Page() {
    const { user } = useUserStore();
    const [guilds, setGuilds] = useState<RESTGetAPICurrentUserGuildsResult>([]);

    useEffect(() => {
        if (!user) return;

        const run = async () => {
            const supabase = createClient();

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session || !session.provider_token) {
                return redirect("/auth/login", RedirectType.replace);
            }

            const { data, error } = await fetchDiscordGuilds(session.provider_token);
            setGuilds(error ? [] : (data ?? []));

            console.log(error);
        };

        run();
    }, [user]);

    return (
        <main className="p-6 space-y-4">
            {user?.email}
            <div className="max-w-6xl mx-auto p-4 grid grid-cols-4">
                {guilds.map((guild) => {
                    const iconExt = guild.icon?.startsWith("a_") ? ImageFormat.GIF : ImageFormat.WebP;
                    const iconUrl = guild.icon
                        ? RouteBases.cdn + CDNRoutes.guildIcon(guild.id, guild.icon, iconExt)
                        : null;

                    return (
                        <div key={guild.id} className="p-3 border rounded">
                            {iconUrl ? (
                                <Image
                                    src={iconUrl}
                                    alt={`${guild.name} icon`}
                                    width={48}
                                    height={48}
                                    unoptimized
                                    className="w-12 h-12 rounded-md"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-sm">
                                    {guild.name}
                                </div>
                            )}
                            <div className="mt-2 font-medium">{guild.name}</div>
                            <div className="text-xs text-gray-500">{guild.id}</div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
