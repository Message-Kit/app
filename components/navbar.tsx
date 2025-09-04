"use client";

import Image from "next/image";

export default function Navbar() {
    return (
        <div className="p-4 bg-card border-b flex">
            <a href="https://messagekit.app">
                <div className="flex items-center gap-2.5">
                    <Image src="/logo.svg" className="size-7" alt="Logo" width={32} height={32} />
                    <span className="text-lg font-semibold font-display">Message Kit</span>
                </div>
            </a>
        </div>
    );
}
