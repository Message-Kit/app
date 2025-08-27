"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Template } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Hash } from "lucide-react";

interface TemplateWithActions extends Template {
    actions: React.ReactNode;
}

export const columns: ColumnDef<TemplateWithActions>[] = [
    {
        accessorKey: "name",
        header: () => {
            return <div className="px-2 py-4 font-medium text-muted-foreground">Name</div>;
        },
        cell: ({ row }) => {
            return <div className="p-2">{row.original.name}</div>;
        },
    },
    {
        accessorKey: "id",
        header: () => {
            return <div className="px-2 py-4 font-medium text-muted-foreground">Template ID</div>;
        },
        cell: ({ row }) => {
            return <div className="p-2 font-mono">{row.original.id}</div>;
        },
    },
    {
        accessorKey: "guild_id",
        header: () => {
            return <div className="px-2 py-4 font-medium text-muted-foreground">Channel</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="p-2">
                    <Badge variant={"secondary"}>
                        <Hash />
                        {row.original.guild_id}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "updated_at",
        header: () => {
            return <div className="px-2 py-4 font-medium text-muted-foreground">Last Updated</div>;
        },
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            const full = date.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

            return (
                <div className="p-2">
                    <Tooltip>
                        <TooltipTrigger>{date.toLocaleDateString()}</TooltipTrigger>
                        <TooltipContent>{full}</TooltipContent>
                    </Tooltip>
                </div>
            );
        },
    },
    {
        accessorKey: "actions",
        header: () => {
            return <div className="px-2 py-4 font-medium text-muted-foreground">Actions</div>;
        },
        cell: ({ row }) => {
            return row.original.actions;
        },
    },
];
