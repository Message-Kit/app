"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import supabase from "@/lib/supabase";
import { Template } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVerticalIcon, Hash, Trash } from "lucide-react";
import { toast } from "sonner";

export const columns: ColumnDef<Template>[] = [
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
            async function deleteTemplateInSupabase(id: string) {
                const { error } = await supabase.from("templates").delete().eq("id", id);

                if (!error) {
                    toast.success("Template deleted");
                } else {
                    console.error(error);
                }

                window.location.reload();
            }

            return (
                <div className="justify-center flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"ghost"} className="mr-8">
                                <EllipsisVerticalIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => (window.location.href = `templates/${row.original.id}`)}>
                                <Edit />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteTemplateInSupabase(row.original.id)}>
                                <Trash className="text-destructive" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
