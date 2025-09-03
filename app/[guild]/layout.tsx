"use client";

import type { APIGuild } from "discord-api-types/v10";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [guild, setGuild] = useState<APIGuild | null | undefined>(undefined);
    const params = useParams();

    useEffect(() => {
        const controller = new AbortController();

        fetch(`/api/discord/guilds/${params.guild}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => setGuild(data.guild))
            .catch((error) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setGuild(null);
            });

        return () => controller.abort();
    }, [params.guild]);

    // useEffect(() => console.log(guild), [guild]);
    // useEffect(() => console.log(params.guild), [params.guild]);

    return (
        <SidebarProvider>
            <AppSidebar guild={guild} />
            <main className="w-full flex flex-col h-screen">
                <Navbar />
                <Separator />
                <div className="flex-1 h-full">{children}</div>
            </main>
        </SidebarProvider>
    );
}
