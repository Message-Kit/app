"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.signOut();
        redirect("/");
    }, [supabase]);

    return <div className="flex justify-center items-center h-screen">Logging you out...</div>;
}
