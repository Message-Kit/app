"use client";
import supabase from "@/lib/supabase";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user";

export default function UserProvider() {
    const { setUser } = useUserStore();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUser(data.user);
            }
        });
    }, [setUser]);

    return null;
}
