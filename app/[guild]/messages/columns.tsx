"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Template } from "@/types/db";

interface TemplateWithActions extends Template {
    actions: React.ReactNode;
}

export const columns: ColumnDef<TemplateWithActions>[] = [
    {
        accessorKey: "name",
        header: () => <div className="px-2 py-4 opacity-50">Name</div>,
        cell: ({ row }) => {
            const [loading, setLoading] = useState(false);

            return (
                <div className="p-2">
                    <Link
                        className="flex gap-2 items-center underline underline-offset-2"
                        href={`/${row.original.guild_id}/messages/${row.original.id}`}
                        onClick={() => setLoading(true)}
                    >
                        {row.original.name.length > 32 ? `${row.original.name.slice(0, 32)}...` : row.original.name}
                        {loading ? (
                            <Loader2Icon size={14} className="animate-spin" />
                        ) : (
                            <ExternalLinkIcon size={14} className="opacity-50" />
                        )}
                    </Link>
                </div>
            );
        },
    },
    {
        accessorKey: "id",
        header: () => <div className="px-2 py-4 opacity-50">Message ID</div>,
        cell: ({ row }) => <div className="p-2 font-mono">{row.original.id}</div>,
    },
    // {
    //     accessorKey: "guild_id",
    //     header: () => <div className="px-2 py-4 opacity-50">Guild ID</div>,
    //     cell: ({ row }) => <div className="p-2">{row.original.guild_id}</div>,
    // },
    {
        accessorKey: "created_at",
        header: () => <div className="px-2 py-4 opacity-50">Created At</div>,
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            const full = date.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

            return (
                <div className="p-2">
                    <Tooltip>
                        <TooltipTrigger className="text-muted-foreground">{date.toLocaleDateString()}</TooltipTrigger>
                        <TooltipContent>{full}</TooltipContent>
                    </Tooltip>
                </div>
            );
        },
    },
    {
        accessorKey: "updated_at",
        header: () => <div className="px-2 py-4 opacity-50">Updated At</div>,
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            const full = date.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

            return (
                <div className="p-2">
                    <Tooltip>
                        <TooltipTrigger className="text-muted-foreground">{date.toLocaleDateString()}</TooltipTrigger>
                        <TooltipContent>{full}</TooltipContent>
                    </Tooltip>
                </div>
            );
        },
    },
    {
        accessorKey: "actions",
        header: () => {
            return <div className="px-2 py-4 opacity-50">Actions</div>;
        },
        cell: ({ row }) => {
            return <div className="ml-6">{row.original.actions}</div>;
        },
    },
];
