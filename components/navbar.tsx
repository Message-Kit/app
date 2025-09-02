"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <div className="min-h-16 max-h-16 bg-card w-full px-6 flex items-center z-10">
            <span className="font-display text-lg font-semibold">
                {pathname.split("/")[2]
                    ? pathname.split("/")[2]?.charAt(0).toUpperCase() + pathname.split("/")[2]?.slice(1).toLowerCase()
                    : "Home"}
            </span>
        </div>
    );
}
