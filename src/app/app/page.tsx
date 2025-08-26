"use client";

import { useNavbar } from "@/stores/navbar";
import { useUserStore } from "@/stores/user";
import { useEffect } from "react";

export default function Page() {
    const { user } = useUserStore();
    const { setHeading } = useNavbar();

    useEffect(() => {
        setHeading("Home");
    }, [setHeading]);

    return (
        <div className="p-4">
            <div className="h-96 w-full flex flex-col justify-center items-center">
                <span className="text-muted-foreground text-sm">Nothing to see here...</span>
                <br />
                {user?.email}
            </div>
        </div>
    );
}
