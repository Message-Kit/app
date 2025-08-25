import AppSidebar from "@/components/app-sidebar";
import MyBreadcrumbs from "@/components/my-breadcrumbs";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Send } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="fixed left-0 top-0 -z-10 h-full w-full">
                <div className="my-gradient"></div>
            </div>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <div className="px-6 h-16 border-b flex gap-6 items-center justify-between sticky top-0 w-full bg-background/50 backdrop-blur-2xl z-40">
                        <MyBreadcrumbs />
                        <Button>
                            <Send />
                            Send
                        </Button>
                    </div>
                    {children}
                </main>
            </SidebarProvider>
            <Toaster richColors position="bottom-right" />
        </div>
    );
}
