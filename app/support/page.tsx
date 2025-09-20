"use client";

import { useEffect } from "react";

const INVITE_LINK = "https://discord.gg/5bBM2TVDD3";

export default function Page() {
    useEffect(() => {
        location.href = INVITE_LINK;
    }, []);

    return (
        <div className="flex justify-center items-center h-screen p-4 text-muted-foreground text-sm font-medium">
            Redirecting...
        </div>
    );
}
