"use client";

import supa from "@/lib/supabase";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { PropsWithChildren, useEffect } from "react";

export default function UserProvider({ children }: PropsWithChildren) {
    const { setUser } = useUserStore();
    const { setSession } = useSessionStore();

    useEffect(() => {
        (async () => {
            const { data } = await supa.auth.getUser();
            const { data: sessionData } = await supa.auth.getSession();

            if (data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }

            if (sessionData?.session) {
                setSession(sessionData.session);
            } else {
                setSession(null);
            }
        })();
    }, []);

    return <>{children}</>;
}
