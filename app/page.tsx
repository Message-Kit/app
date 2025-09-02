"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import {
    CDNRoutes,
    ImageFormat,
    PermissionFlagsBits,
    type RESTGetAPICurrentUserGuildsResult,
    RouteBases,
} from "discord-api-types/v10";
import { ChevronRightIcon, LogOutIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/lib/stores/user-store";
import { fetchDiscordGuilds, getDiscordProviderToken } from "./actions";

function PageContent() {
    const { user } = useUserStore();
    const [guilds, setGuilds] = useState<RESTGetAPICurrentUserGuildsResult>([]);

    const params = useSearchParams();
    const blocked = params.get("blockedFrom");
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const run = async () => {
            const { token } = await getDiscordProviderToken();
            const { data, error: guildsError } = await fetchDiscordGuilds(token ?? "");

            setGuilds(guildsError ? [] : (data ?? []));
        };

        run();
    }, [user]);

    useEffect(() => {
        if (blocked) {
            alert("You cannot access this page!");
            router.replace("/");
        }
    }, [blocked, router]);

    return (
        <div className="max-w-md mx-auto px-4 py-32 flex flex-col justify-center h-screen">
            {user ? (
                <>
                    <div className="flex flex-col gap-1 mb-8 items-center">
                        {typeof user?.user_metadata?.name === "string" && (
                            <span className="font-semibold text-xl font-display">
                                Welcome, {user.user_metadata.name.slice(0, -2)}!
                            </span>
                        )}
                        <span className="text-muted-foreground text-sm">Choose a server below to continue.</span>
                    </div>
                    {guilds.length === 0 ? (
                        <Spinner size={"medium"} />
                    ) : (
                        <ScrollArea className="max-h-[500px] rounded-xl border">
                            {guilds.map((guild) => {
                                const perms = BigInt(guild.permissions);
                                const hasAdmin =
                                    (perms & BigInt(PermissionFlagsBits.Administrator.toString())) !== BigInt(0);

                                if (!hasAdmin) return null;

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
                                            <div className="text-sm text-gray-500">{hasAdmin ? "Admin" : "Member"}</div>
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
                    <div className="flex gap-2 mt-8 justify-center">
                        <Button asChild>
                            <Link href={"https://discord.com/oauth2/authorize?client_id=1067725778512519248"}>
                                <PlusIcon />
                                Add Server
                            </Link>
                        </Button>
                        <Button variant={"ghost"} asChild>
                            <Link href={"/auth/logout"}>
                                <LogOutIcon />
                                Logout
                            </Link>
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-1 w-full">
                    <span className="text-xl font-semibold font-display">Sign in to continue</span>
                    <span className="text-sm text-muted-foreground">You must be logged in to use Message Kit.</span>
                    <Button asChild className="mt-8" size={"lg"}>
                        <Link href={"/auth/login"}>
                            <SiDiscord />
                            Sign in with Discord
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col justify-center items-center h-screen">
                    <Spinner size={"medium"} />
                </div>
            }
        >
            <PageContent />
        </Suspense>
    );
}
