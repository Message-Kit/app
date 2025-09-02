"use client";

import { type APIGuild, CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import { ChevronsUpDownIcon, ExternalLinkIcon, MessagesSquare, Pickaxe, TextCursorInput } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export default function AppSidebar() {
    const [guild, setGuild] = useState<APIGuild | null | undefined>(undefined);
    const [guildIcon, setGuildIcon] = useState<string | null | undefined>(undefined);

    const pathname = usePathname();
    const params = useParams();

    function isPathActive(path: string) {
        const parts = pathname?.split("/") || [];
        if (parts.length < 3) return false;

        return `/${parts[2]}` === path;
    }

    const guildId = params.guild;

    const sidebarGroups = [
        {
            name: "Platform",
            items: [
                {
                    icon: MessagesSquare,
                    name: "Messages",
                    url: "/messages",
                },
                {
                    icon: Pickaxe,
                    name: "Actions",
                    url: "/actions",
                },
                {
                    icon: TextCursorInput,
                    name: "Forms",
                    url: "/forms",
                },
            ],
        },
    ];

    useEffect(() => {
        if (!guildId) return;

        setGuild(undefined);
        setGuildIcon(undefined);

        const controller = new AbortController();

        fetch(`/api/discord/guilds/${guildId}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => {
                if (controller.signal.aborted) return;

                const g = data.guild as APIGuild | null | undefined;
                if (g) {
                    setGuild(g);

                    if (g.icon) {
                        const format = g.icon.startsWith("a_") ? ImageFormat.GIF : ImageFormat.WebP;
                        const url = RouteBases.cdn + CDNRoutes.guildIcon(g.id, g.icon, format);
                        setGuildIcon(url);
                    } else {
                        setGuildIcon(null);
                    }
                } else {
                    setGuild(null);
                    setGuildIcon(null);
                }
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setGuild(null);
                setGuildIcon(null);
            });

        return () => controller.abort();
    }, [guildId]);

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuItem>
                                <SidebarMenuButton size={"lg"}>
                                    {guildIcon === undefined ? (
                                        <Skeleton className="rounded-md size-9" />
                                    ) : guildIcon === null ? (
                                        <div className="rounded-md size-9 bg-primary" />
                                    ) : (
                                        <Image
                                            width={32}
                                            height={32}
                                            className="rounded-md size-9"
                                            alt="Guild icon"
                                            src={guildIcon}
                                        />
                                    )}
                                    {guild ? (
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="font-semibold font-display">{guild.name}</span>
                                            <span
                                                className="block w-full text-xs text-muted-foreground truncate"
                                                title={guild.description ?? ""}
                                            >
                                                {guild.description}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="rounded-md h-4 w-32" />
                                            <Skeleton className="rounded-md h-4 w-20" />
                                        </div>
                                    )}
                                    {guildIcon === undefined ? null : <ChevronsUpDownIcon />}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/">
                                    <ExternalLinkIcon />
                                    Select another server
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {sidebarGroups.map((group) => (
                    <SidebarGroup key={group.name}>
                        <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.name}
                                            isActive={isPathActive(item.url)}
                                        >
                                            <Link href={guildId ? `/${guildId}${item.url}` : item.url}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
