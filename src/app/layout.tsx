import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const interTight = Inter_Tight({
    variable: "--font-inter-tight",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MessageKit",
    description:
        "Create beautiful messages with embeds, containers, and components for your Discord server.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${interTight.variable} antialiased font-body`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarProvider>
                        <AppSidebar />
                        <main className="w-full">
                            <div className="flex items-center gap-2 h-16 px-6 border-b">
                                <DynamicBreadcrumb />
                            </div>
                            {children}
                        </main>
                        <Toaster position="top-center" richColors />
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
