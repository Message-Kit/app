"use client";

import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full flex flex-col h-screen">
                <Navbar />
                <Separator />
                <div className="flex-1 h-full">{children}</div>
            </main>
        </SidebarProvider>
    );
}
