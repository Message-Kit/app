import type { Metadata } from "next";
import { Inter, Inter_Tight, Work_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import UserProvider from "@/components/user-provider";

const bodyFont = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const displayFont = localFont({
    src: "../../public/ClashDisplay-Variable.woff2",
    variable: "--font-some-font",
    display: "swap",
});

const discordFont = localFont({
    src: "../../public/ggsansvf-VF.woff2",
    variable: "--font-gg-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Message Kit",
    description: "Create rich and beautiful messages for your Discord server.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${bodyFont.className} ${displayFont.variable} ${discordFont.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
