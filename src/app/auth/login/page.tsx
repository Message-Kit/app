"use client";

import supa from "@/lib/supabase";
import { useEffect } from "react";

export default function Login() {
    useEffect(() => {
        supa.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: "http://localhost:3001/auth/callback",
                scopes: "identify email guilds",
            },
        });
    }, []);

    return <div>logging you in...</div>;
}
