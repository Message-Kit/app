import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./providers/user-provider";

const body = Inter({
    variable: "--font-body-font",
    subsets: ["latin"],
});

const display = Inter_Tight({
    variable: "--font-display-font",
    subsets: ["latin"],
});

const discord = localFont({
    src: "../public/ggsans.woff2",
    variable: "--font-preview-font",
});

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Dashboard to manage messages for Message Kit.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${body.variable} ${display.variable} ${discord.variable} font-body antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                    <UserProvider>{children}</UserProvider>
                    <Toaster richColors position="top-center" />
                </ThemeProvider>
            </body>
        </html>
    );
}
