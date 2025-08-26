import AppSidebar from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="size-full">
                    <div className="w-full h-16 sticky top-0 z-40 bg-background/50 backdrop-blur-2xl">
                        <div className="px-8 flex gap-6 items-center justify-between h-full">
                            <span className="text-lg font-medium">{"Templates"}</span>
                        </div>
                        <Separator />
                    </div>
                    {children}
                </div>
            </SidebarProvider>
            <Toaster richColors position="bottom-right" />
        </>
    );
}
