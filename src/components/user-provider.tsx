"use client";
import supabase from "@/lib/supabase";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user";

export default function UserProvider() {
    const { setUser } = useUserStore();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.provider_token) {
                supabase.auth.signOut();
            }
        });

        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUser(data.user);
            }
        });
    }, [setUser]);

    return null;
}
