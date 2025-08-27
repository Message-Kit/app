import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import UserProvider from "@/components/user-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UserProvider />
            <SidebarProvider>
                <AppSidebar />
                <div className="size-full">
                    <Navbar />
                    {children}
                </div>
            </SidebarProvider>
            <Toaster richColors position="bottom-right" />
        </>
    );
}
