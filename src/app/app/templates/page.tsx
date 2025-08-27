"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangleIcon, EllipsisVerticalIcon, Edit, Plus, Search, Trash } from "lucide-react";
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
import { useNavbar } from "@/stores/navbar";
import { useGuildStore } from "@/stores/guild";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function TemplateActions({ id, onDeleted }: { id: string; onDeleted: () => void }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    async function deleteTemplateInSupabase(id: string) {
        const { error } = await supabase.from("templates").delete().eq("id", id);

        if (!error) {
            toast.success("Template deleted");
            onDeleted();
        } else {
            console.error(error);
        }
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
                    <DropdownMenuItem onClick={() => (window.location.href = `templates/${id}`)}>
                        <Edit />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDeleteDialog(true);
                        }}
                    >
                        <Trash className="text-destructive" />
                        Delete
                    </DropdownMenuItem>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Template</DialogTitle>
                                <DialogDescription>Are you sure you want to delete this template?</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant={"outline"}>Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button variant={"destructive"} onClick={() => deleteTemplateInSupabase(id)}>
                                        Delete
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default function Page() {
    const { setHeading } = useNavbar();

    useEffect(() => {
        setHeading("Templates");
    }, [setHeading]);

    interface TemplateWithActions extends Template {
        actions: React.ReactNode;
    }

    const [templates, setTemplates] = useState<TemplateWithActions[]>([]);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [shouldReloadTable, setShouldReloadTable] = useState(false);
    // const [showAlert, setShowAlert] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
    const [shouldSearch, setShouldSearch] = useState(false);

    const { user } = useUserStore();
    const { guild } = useGuildStore();

    // debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchInput(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        if (!user) return;
        if (!guild) return;

        const fetchTemplates = async () => {
            const { data, error } = await supabase
                .from("templates")
                .select("*")
                .eq("guild_id", guild.id)
                .ilike("name", `%${debouncedSearchInput}%`);

            if (error) {
                console.error(error);
            } else {
                setTemplates(
                    data.map((template) => ({
                        ...template,
                        actions: (
                            <TemplateActions
                                id={template.id}
                                onDeleted={() => {
                                    setShouldReloadTable(true);
                                }}
                            />
                        ),
                    }))
                );
            }
        };

        fetchTemplates();

        setShouldReloadTable(false);
        setShouldSearch(false);
    }, [user, guild, shouldReloadTable, shouldSearch, debouncedSearchInput]);

    async function createTemplateInSupabase() {
        if (!guild) return;
        if (!user) return;

        const { error } = await supabase.from("templates").insert({ id: nanoid(10), name: newTemplateName, guild_id: guild.id, uuid: user.id });

        if (!error) {
            setShouldReloadTable(true);
        } else {
            console.error(error);
        }
    }

    return (
        <div className="p-4 max-w-4xl mx-auto py-0 md:py-20">
            {!guild && (
                <Alert variant="default" className="mb-8">
                    <AlertTriangleIcon className="text-destructive" />
                    <AlertTitle>Choose a server</AlertTitle>
                    <AlertDescription>You can only create templates once a server has been selected.</AlertDescription>
                </Alert>
            )}
            <div className="flex gap-2 justify-between">
                {/* search input box */}
                <div className="flex gap-4 items-center">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShouldSearch(true);
                        }}
                    >
                        <div className="relative w-fit">
                            <Input
                                className="peer pe-9"
                                placeholder="Search templates"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                                <Search size={16} aria-hidden="true" />
                            </div>
                        </div>
                    </form>

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
