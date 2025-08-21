"use client";

import supabase from "@/lib/supabase";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        const yes = async () => {
            await supabase.auth.signInWithOAuth({
                provider: "discord",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        };

        yes();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            Logging you in...
        </div>
    );
}
