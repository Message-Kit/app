"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase"; // your client

export default function AuthCallback() {
    const router = useRouter();
    useEffect(() => {
        const hash = window.location.hash.slice(1); // remove leading '#'
        if (!hash) return router.replace("/login"); // no tokens
        const p = new URLSearchParams(hash);
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
            supabase.auth
                .setSession({ access_token, refresh_token })
                .then(() => router.replace("/app"))
                .catch((e) => {
                    console.error("setSession failed", e);
                    router.replace("/login");
                });
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            Almost there...
        </div>
    );
}
