"use client";

import { EditIcon, MoreVerticalIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/lib/stores/user-store";
import type { Template } from "@/types/db";
import { createClient } from "@/utils/supabase/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function MessageActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <EditIcon />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <TrashIcon />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Page() {
    const params = useParams();
    const supabase = createClient();

    interface TemplateWithActions extends Template {
        actions: React.ReactNode;
    }

    const { user } = useUserStore();
    const [data, setData] = useState<TemplateWithActions[] | null>(null);
    const [newMessageName, setNewMessageName] = useState<string>("Untitled message");

    useEffect(() => {
        supabase
            .from("templates")
            .select("*")
            .eq("guild_id", params.guild)
            .order("updated_at", { ascending: false })
            .then(({ data, error }) => {
                if (error) {
                    console.log(error);
                } else {
                    setData(data.map((item) => ({ ...item, actions: <MessageActions /> })));
                }
            });
    }, [supabase, params]);

    async function createNewMessageInSupabase() {
        supabase
            .from("templates")
            .insert({
                id: nanoid(10),
                guild_id: params.guild,
                uuid: user?.id,
                name: newMessageName,
                body: null,
            })
            .select("*")
            .then(({ data: newData, error }) => {
                if (error) {
                    console.log(error);
                } else if (newData?.[0]) {
                    setData((prev) => [{ ...newData[0], actions: <MessageActions /> }, ...(prev ?? [])]);
                }
            });
    }

    if (!data) {
        return (
            <div className="p-4 flex justify-center items-center size-full">
                <Spinner size={"medium"} />
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-32 max-w-4xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
                <div className="w-fit">
                    <Label htmlFor="search-templates" className="sr-only">
                        Search Messages
                    </Label>
                    <div className="relative w-fit">
                        <Input id="search-templates" className="peer ps-9" placeholder="Search Messages" type="text" />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                            <SearchIcon size={16} aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon />
                            New Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Message</DialogTitle>
                            <DialogDescription>Create a new message for your server.</DialogDescription>
                        </DialogHeader>
                        <Input
                            placeholder="Name"
                            type="text"
                            value={newMessageName}
                            onChange={(e) => setNewMessageName(e.target.value)}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button onClick={createNewMessageInSupabase}>Continue</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {data && <DataTable columns={columns} data={data} />}
        </div>
    );
}
