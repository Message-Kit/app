"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supa from "@/lib/supabase";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";

export default function Page() {
    const router = useRouter();
    const { setUser } = useUserStore();
    const { setSession } = useSessionStore();

    useEffect(() => {
        (async () => {
            await supa.auth.signOut();
            setUser(null);
            setSession(null);
            router.replace("/");
        })();
    }, []);

    return <div>Logging you out..</div>;
}
