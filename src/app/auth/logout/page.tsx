"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.signOut().then(() => {
            router.push("/app");
        });
    }, [router]);

    return null;
}
