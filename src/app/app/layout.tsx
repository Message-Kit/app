import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="fixed left-0 top-0 -z-10 h-full w-full">
                <div className="my-gradient"></div>
            </div>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-4xl mx-auto">{children}</main>
            </SidebarProvider>
            <Toaster richColors position="top-center" />
        </div>
    );
}
