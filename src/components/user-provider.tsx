"use client";
import supabase from "@/lib/supabase";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";

export default function UserProvider() {
    const { setUser } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        // supabase.auth.getSession().then(({ data: { session } }) => {
        //     if (!session?.provider_token) {
        //         supabase.auth.signOut();
        //     }
        // });

        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUser(data.user);
            } else {
                router.push("/auth/login");
            }
        });
    }, [setUser, router]);

    return null;
}
