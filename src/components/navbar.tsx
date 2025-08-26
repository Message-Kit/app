"use client";

import { useNavbar } from "@/stores/navbar";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
    const { heading } = useNavbar();

    return (
        <div className="w-full h-16 sticky top-0 z-40 bg-background/50 backdrop-blur-2xl">
            <div className="px-8 flex gap-6 items-center justify-between h-full">
                <span className="text-lg font-medium">{heading === null ? <Skeleton className="w-24 h-6" /> : heading}</span>
            </div>
            <Separator />
        </div>
    );
}
