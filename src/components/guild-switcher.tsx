"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarMenuButton } from "./ui/sidebar";
import { useUserStore } from "@/stores/user";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useGuildStore } from "@/stores/guild";
import { Skeleton } from "./ui/skeleton";
import { Guild } from "@/types/discord";
import Image from "next/image";

export function GuildSwitcher() {
    const [open, setOpen] = useState(false);
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const { user } = useUserStore();
    const { guild, setGuild } = useGuildStore();

    useEffect(() => {
        if (!user) return;

        // console.log("got user");

        const fetchGuilds = async () => {
            const { data: sessionData } = await supabase.auth.getSession();

            if (!sessionData) return;
            if (!sessionData.session) return;

            // console.log("got session data and session");

            const providerToken = sessionData.session.provider_token;
            if (!providerToken) return;

            // console.log("got provider token");

            const response = await fetch("/api/get-server-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerToken }),
            });

            // console.log("got guilds");

            const data = await response.json();

            if (data.success) {
                setGuilds(data.data);
                // console.log("got guilds data");
            }
        };

        fetchGuilds();
    }, [user]);

    useEffect(() => {
        if (!guilds.length) return;
        if (guild && !guilds.some((g) => g.id === guild.id)) {
            setGuild(null);
        }
    }, [guilds, guild, setGuild]);

    useEffect(() => {
        if (!guilds.length || guild) return;
        const storedId = typeof window !== "undefined" ? localStorage.getItem("selectedGuildId") : null;
        if (!storedId) return;
        const matched = guilds.find((g) => g.id === storedId);
        if (matched) setGuild(matched);
    }, [guilds, guild, setGuild]);

    const selectedGuildName = guild?.name;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-2.5"
                >
                    {!guild ? (
                        <Skeleton className="size-8 rounded-sm" />
                    ) : (
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8 rounded-sm overflow-hidden">
                            {guild.icon ? (
                                <Image
                                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                                    alt="guild icon"
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex justify-center items-center size-full">
                                    <span className="font-medium font-ass text-sm">
                                        {guild.name
                                            .split(" ")
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .map((word) => word[0]?.toUpperCase())
                                            .join("")
                                            .slice(0, 2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5 leading-tight">
                        <span className="font-medium">
                            {selectedGuildName ? (
                                selectedGuildName.length > 24 ? (
                                    selectedGuildName.slice(0, 21) + "..."
                                ) : (
                                    selectedGuildName
                                )
                            ) : (
                                <Skeleton className="w-32 h-4" />
                            )}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {selectedGuildName ? "Basic Plan" : <Skeleton className="w-24 h-4" />}
                        </span>
                    </div>
                    {selectedGuildName && <ChevronsUpDown className="ml-auto" />}
                </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="end">
                <Command>
                    <CommandInput placeholder="Search guild..." />
                    <CommandList>
                        <CommandEmpty>
                            <span className="text-muted-foreground">No guilds found :(</span>
                        </CommandEmpty>
                        <CommandGroup>
                            {guilds.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.name}
                                    onSelect={() => {
                                        setGuild(option);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon className={cn("", guild?.id === option.id ? "opacity-100" : "opacity-0")} />
                                    {option.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
