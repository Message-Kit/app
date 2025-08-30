"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                scopes: "identify email guilds",
            },
        });

        if (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
            Login with Discord
        </button>
    );
}

export function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
            Logout
        </button>
    );
}
