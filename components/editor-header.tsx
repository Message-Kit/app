import type { APIGuild, APIMessageTopLevelComponent } from "discord-api-types/v10";
import {
    DownloadIcon,
    EraserIcon,
    PickaxeIcon,
    PlusIcon,
    RefreshCcwIcon,
    SaveIcon,
    SquareDashedMousePointerIcon,
    UploadIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import { type Dispatch, Fragment, type SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { componentDescriptors } from "@/lib/options";
import { useGuildStore } from "@/lib/stores/guild";
import { useShouldInspectStore } from "@/lib/stores/should-inspect";
import { useUserStore } from "@/lib/stores/user-store";
import { append, defaultComponents } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function EditorHeader({
    setComponents,
    components,
    templateId,
}: {
    setComponents: Dispatch<SetStateAction<APIMessageTopLevelComponent[]>>;
    components: APIMessageTopLevelComponent[];
    templateId: string;
}) {
    const { shouldInspect, setShouldInspect } = useShouldInspectStore();
    const { user } = useUserStore();
    const { guild, setGuild } = useGuildStore();

    const [guilds, setGuilds] = useState<APIGuild[] | null>(null);
    const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const addComponent = <T extends APIMessageTopLevelComponent>(component: T) =>
        setComponents((previousComponents) => append(previousComponents, component));

    const componentsList = componentDescriptors.map((descriptor) => ({
        name: descriptor.name,
        type: descriptor.type,
        icon: descriptor.icon,
        onClick: () => addComponent(descriptor.create() as APIMessageTopLevelComponent),
        disabled: descriptor.disabled,
    }));

    useEffect(() => {
        if (!user) return;

        fetch("/api/discord/guilds")
            .then((res) => res.json())
            .then((data) => {
                setGuilds(data.guilds);
            });
    }, [user]);

    function getAndSetGuild(guildId: string) {
        fetch(`/api/discord/guilds/${guildId}`)
            .then((res) => res.json())
            .then((data) => setGuild(data.guild));
    }

    function handleExport() {
        const download = new Blob([JSON.stringify(components, null, 4)], { type: "application/json" });
        const url = URL.createObjectURL(download);

        const a = document.createElement("a");
        a.href = url;
        a.download = "msgkit-export.json";
        a.click();

        URL.revokeObjectURL(url);
    }

    async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        setComponents(data);
    }

    async function handleSaveTemplate() {
        if (!user) return;

        const supabase = createClient();
        const randomTemplateId = nanoid(10);

        const { error } = await supabase.from("templates").insert({
            template_id: randomTemplateId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: user.id,
            components: components,
            name: newTemplateName,
        });

        if (error) {
            return toast.error("Something went wrong!");
        }

        window.location.href = `/${randomTemplateId}`;
    }

    async function handleUpdateMessage() {
        if (!user) return;
        const supabase = createClient();

        const { error } = await supabase.from("templates").upsert({
            template_id: templateId,
            components: components,
            updated_at: new Date().toISOString(),
            user: user.id,
        });

        if (error) {
            return toast.error("Something went wrong!");
        } else {
            toast.success("Saved!");
        }
    }

    return (
        <>
            <div className="flex justify-between gap-2 p-4 overflow-x-auto border-b border-dashed">
                <div className="flex gap-2 items-center">
                    {/* <a href="/">
                        <Image
                            src="/logo.svg"
                            className="min-w-[30px] max-w-[30px] hidden md:block"
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                    </a>
                    <Separator orientation="vertical" className="opacity-0 hidden md:block" /> */}
                    {user && (
                        <Select
                            disabled={guilds === null}
                            onValueChange={(value) => getAndSetGuild(value)}
                            defaultValue={guild?.id}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder={guilds === null ? "Loading guilds..." : "Select a guild"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="w-full flex justify-between">
                                        <span>Guilds</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button type="button" className="hover:text-foreground cursor-pointer">
                                                    <RefreshCcwIcon className="size-4" />
                                                    {/* <ExternalLinkIcon className="size-4" /> */}
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Reload</TooltipContent>
                                        </Tooltip>
                                    </SelectLabel>
                                    {guilds?.map((guild) => {
                                        return (
                                            <SelectItem key={guild.id} value={guild.id}>
                                                {guild.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                    {user === undefined && <Skeleton className="w-[200px] h-full" />}
                </div>
                <div className="flex gap-2">
                    {/* EXPORT/IMPORT BUTTONS */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleExport}>
                                <UploadIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export as JSON</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                                <DownloadIcon />
                                <input className="sr-only" type="file" ref={fileInputRef} onChange={handleImport} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Import from JSON</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" />

                    {/* INSPECT BUTTON */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={shouldInspect ? "secondary" : "ghost"}
                                size="icon"
                                onClick={() => {
                                    setShouldInspect(!shouldInspect);
                                }}
                                className="hidden md:inline-flex"
                            >
                                <SquareDashedMousePointerIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Inspect</TooltipContent>
                    </Tooltip>

                    {/* CLEAR COMPONENS BUTTON */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <EraserIcon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>This will remove all components in this message.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button variant={"destructive"} onClick={() => setComponents(defaultComponents)}>
                                        Confirm
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* SAVE MESSAGE BUTTON */}
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={!user}
                        onClick={() => {
                            if (templateId === "new") {
                                setShowNewTemplateDialog(!showNewTemplateDialog);
                            } else {
                                handleUpdateMessage();
                            }
                        }}
                    >
                        <SaveIcon />
                    </Button>

                    <Separator orientation="vertical" />

                    {/* ACTIONS LINK BUTTON */}
                    <Button variant="ghost" asChild>
                        <Link href={"/actions"}>
                            <PickaxeIcon />
                            Actions
                        </Link>
                    </Button>

                    {/* ADD COMPONENT BUTTON */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>
                                <PlusIcon />
                                Add Component
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {/* <DropdownMenuLabel className="text-xs text-muted-foreground">Content</DropdownMenuLabel> */}
                            {componentsList.map((component, index) => (
                                <Fragment key={`${component.type}-${index}`}>
                                    {component.name === "Container" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                Layout
                                            </DropdownMenuLabel>
                                        </>
                                    )}
                                    {component.name === "Buttons" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                Interactive
                                            </DropdownMenuLabel>
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={component.onClick} disabled={component.disabled}>
                                        <component.icon />
                                        {component.name}
                                    </DropdownMenuItem>
                                </Fragment>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* SAVE MESSAGE DIALOG */}
            <Dialog onOpenChange={setShowNewTemplateDialog} open={showNewTemplateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                        <DialogDescription>Create new message template</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="new-template-name">Name</Label>
                        <Input
                            id="new-template-name"
                            placeholder="Enter name"
                            onChange={(e) => setNewTemplateName(e.currentTarget.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleSaveTemplate}>Confirm</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
