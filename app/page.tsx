"use client";

import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import { ChevronRightIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/lib/stores/user-store";
import { fetchDiscordGuilds, getDiscordProviderToken } from "./actions";

export default function Page() {
    const { user } = useUserStore();
    const [guilds, setGuilds] = useState<RESTGetAPICurrentUserGuildsResult>([]);

    useEffect(() => {
        if (!user) return;

        const run = async () => {
            const { token, error: _tokenError } = await getDiscordProviderToken();

            console.log(token);

            if (!token) {
                return redirect("/auth/login", RedirectType.replace);
            }

            const { data, error: guildsError } = await fetchDiscordGuilds(token ?? "");
            setGuilds(guildsError ? [] : (data ?? []));

            // console.log(tokenError ?? guildsError);
        };

        run();
    }, [user]);

    // if (!user) {
    //     return (
    //         <div className="h-screen flex items-center justify-center">
    //             <Spinner size={"medium"} />
    //         </div>
    //     );
    // }

    return (
        <div className="max-w-lg mx-auto px-4 py-32 flex flex-col justify-center h-screen">
            <div className="flex flex-col gap-2 mb-8">
                {typeof user?.user_metadata?.name === "string" && (
                    <span className="font-medium text-2xl md:text-4xl font-display">
                        Hey <span className="font-bold">{user.user_metadata.name.slice(0, -2)}</span>!
                    </span>
                )}
                <span className="text-muted-foreground">Choose a Discord server below to continue.</span>
            </div>
            {guilds.length === 0 && <Spinner size={"medium"} className="mt-8" />}
            {!guilds ? (
                <Spinner size={"medium"} className="mt-8" />
            ) : (
                <ScrollArea className="max-h-[500px] rounded-xl border">
                    {guilds.map((guild) => {
                        const iconExt = guild.icon?.startsWith("a_") ? ImageFormat.GIF : ImageFormat.WebP;
                        const iconUrl = guild.icon
                            ? RouteBases.cdn + CDNRoutes.guildIcon(guild.id, guild.icon, iconExt)
                            : null;

                        return (
                            <div key={guild.id} className="p-4 border rounded-lg bg-card flex gap-4 mb-2 m-2">
                                <div className="size-11 rounded-lg overflow-hidden">
                                    {iconUrl ? (
                                        <Image
                                            src={iconUrl}
                                            alt={`${guild.name} icon`}
                                            width={48}
                                            height={48}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="bg-primary flex items-center justify-center font-medium size-full">
                                            {guild.name
                                                .split(" ")
                                                .slice(0, 2)
                                                .map((word) => word.charAt(0))
                                                .join("")}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-medium font-display">{guild.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {guild.approximate_member_count} members
                                    </div>
                                    {/* <div className="text-sm text-gray-500">{guild.owner ? "Owner" : "Member"}</div> */}
                                </div>
                                <div className="ml-auto my-auto">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/${guild.id}`}>
                                            <ChevronRightIcon />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </ScrollArea>
            )}
            <div className="flex gap-2 mt-8">
                <Button size={"lg"} asChild>
                    <Link href={"https://discord.com/oauth2/authorize?client_id=1067725778512519248"}>
                        <PlusIcon />
                        Add Server
                    </Link>
                </Button>
            </div>
        </div>
    );
}
