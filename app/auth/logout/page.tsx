"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.signOut();
    }, [supabase]);

    return <div className="flex justify-center items-center h-screen">Logging you out...</div>;
}
