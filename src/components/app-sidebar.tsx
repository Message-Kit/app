"use client";

import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarHeader,
} from "./ui/sidebar";
import {
    Box,
    Layout,
    Palette,
    Component,
    Sparkle,
    Settings,
    TextCursorInput,
    LayoutTemplate,
    PanelTop,
} from "lucide-react";
import Link from "next/link";
import { GuildCombobox } from "./guild-combobox";

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <GuildCombobox />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Interactions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith("/actions")}
                                >
                                    <Link href="/actions">
                                        <Component />
                                        <span>Actions</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(
                                        "/components"
                                    )}
                                >
                                    <Link href="/components">
                                        <Layout />
                                        <span>Components</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith("/forms")}
                                >
                                    <Link href="/forms">
                                        <TextCursorInput />
                                        <span>Forms</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Content</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith("/templates")}
                                >
                                    <Link href="/templates">
                                        <LayoutTemplate />
                                        <span>Templates</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith("/embeds")}
                                >
                                    <Link href="/embeds">
                                        <PanelTop />
                                        <span>Embeds</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(
                                        "/containers"
                                    )}
                                >
                                    <Link href="/containers">
                                        <Box />
                                        <span>Containers</span>
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuBadge>
                                    <Badge variant={"secondary"}>
                                        <Sparkle />
                                        NEW
                                    </Badge>
                                </SidebarMenuBadge>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Other</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/branding"}
                                >
                                    <Link href="/branding">
                                        <Palette />
                                        <span>Branding</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/settings"}
                                >
                                    <Link href="/settings">
                                        <Settings />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut />
                            Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter> */}
        </Sidebar>
    );
}
