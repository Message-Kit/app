"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Template } from "@/types";
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
import LabelInput from "@/components/label-input";
import { useUserStore } from "@/stores/user";
import { nanoid } from "nanoid";

export default function Page() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [shouldReloadTable, setShouldReloadTable] = useState(false);

    const { user } = useUserStore();

    useEffect(() => {
        if (!user) return;
        setShouldReloadTable(true);
    }, [user]);

    useEffect(() => {
        if (!shouldReloadTable) return;

        const fetchTemplates = async () => {
            const { data, error } = await supabase.from("templates").select("*").eq("guild_id", "1138777402684739587");

            if (error) {
                console.error(error);
            } else {
                setTemplates(data);
            }

            setShouldReloadTable(false);
        };

        fetchTemplates();
    }, [shouldReloadTable]);

    async function createTemplateInSupabase() {
        const { error } = await supabase
            .from("templates")
            .insert({ id: nanoid(10), name: newTemplateName, guild_id: "1138777402684739587", uuid: user?.id });

        if (!error) {
            setShouldReloadTable(true);
        } else {
            console.error(error);
        }
    }

    return (
        <div className="p-4 max-w-4xl mx-auto py-16">
            <div className="flex gap-2 mt-4 justify-between">
                {/* search input box */}
                <div className="flex gap-4 items-center">
                    <div className="relative w-fit">
                        <Input className="peer pe-9" placeholder="Search templates" />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                            <Search size={16} aria-hidden="true" />
                        </div>
                    </div>

                    <span className="text-muted-foreground font-medium">{100 - templates.length}/100 remaining</span>
                </div>

                {/* new template button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus />
                            New Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Template</DialogTitle>
                            <DialogDescription>Create a new template to use in your server.</DialogDescription>
                        </DialogHeader>
                        <LabelInput
                            label="Name"
                            id="name"
                            placeholder="Enter template name"
                            required
                            value={newTemplateName}
                            setValue={(e) => setNewTemplateName(e)}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button onClick={createTemplateInSupabase}>Confirm</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-4">
                <DataTable columns={columns} data={templates} />
            </div>
        </div>
    );
}
