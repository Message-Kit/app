"use client";

import supabase from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    useEffect(() => {
        const run = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.replace("/app");
                return;
            }

            await supabase.auth.signInWithOAuth({
                provider: "discord",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    scopes: "identify guilds",
                },
            });
        };

        run();
    }, [router]);

    return <div className="flex justify-center items-center h-screen">Logging you in...</div>;
}
