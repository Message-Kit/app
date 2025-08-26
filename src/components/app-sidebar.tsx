"use client";

import { ChevronsUpDown, GalleryVerticalEnd, MessagesSquare, Pickaxe, SlashSquare, Sparkles, TextCursorInput, Webhook } from "lucide-react";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GuildSwitcher } from "./guild-switcher";
import { Separator } from "./ui/separator";

export default function AppSidebar() {
    const pathname = usePathname();

    function isPathActive(path: string) {
        return pathname?.startsWith(path);
    }

    useEffect(() => {}, []);

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                {/* <SidebarMenu> */}
                {/* <SidebarMenuItem> */}
                {/* <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8 rounded-md overflow-hidden">
                                hi
                            </div>
                            <div className="flex flex-col gap-0.5 leading-tight">
                                <span className="font-medium">{"Rony's Server"}</span>
                                <span className="text-muted-foreground text-xs">Basic Plan</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton> */}
                {/* </SidebarMenuItem> */}
                {/* </SidebarMenu> */}
                <GuildSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPathActive("/app/templates")}>
                                    <Link href="/app/templates">
                                        <MessagesSquare />
                                        Templates
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPathActive("/app/actions")}>
                                    <Link href="/app/actions">
                                        <Pickaxe />
                                        Actions
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPathActive("/app/forms")}>
                                    <Link href="/app/forms">
                                        <TextCursorInput />
                                        Forms
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Miscellaneous</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPathActive("/app/sticky-messages")}>
                                    <Link href="/app/sticky-messages">
                                        <SlashSquare />
                                        Commands
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPathActive("/app/branding")}>
                                    <Link href="/app/branding">
                                        <Sparkles />
                                        Branding
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isPathActive("/app/webhooks")}>
                                    <Link href="/app/webhooks">
                                        <Webhook />
                                        Webhooks
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
