"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase"; // your client

export default function AuthCallback() {
    const router = useRouter();
    useEffect(() => {
        const run = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const error = url.searchParams.get("error") || url.searchParams.get("error_description");
            const hash = window.location.hash;

            try {
                // PKCE/code flow
                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw exchangeError;
                    // clean query params from url
                    window.history.replaceState({}, document.title, url.origin + url.pathname);
                    router.replace("/app");
                    return;
                }

                // implicit flow fallback
                if (hash && hash.includes("access_token") && hash.includes("refresh_token")) {
                    const p = new URLSearchParams(hash.slice(1));
                    const access_token = p.get("access_token");
                    const refresh_token = p.get("refresh_token");
                    if (access_token && refresh_token) {
                        await supabase.auth.setSession({ access_token, refresh_token });
                        window.history.replaceState({}, document.title, url.origin + url.pathname);
                        router.replace("/app");
                        return;
                    }
                }

                if (error) {
                    console.error("oauth error", error);
                }
                router.replace("/auth/login");
            } catch (e) {
                console.error("oauth callback failed", e);
                router.replace("/auth/login");
            }
        };

        run();
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            Almost there...
        </div>
    );
}
