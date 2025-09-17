import type { APIGuild, APIMessageTopLevelComponent } from "discord-api-types/v10";
import {
    DownloadIcon,
    EraserIcon,
    PlusIcon,
    RefreshCcwIcon,
    SquareDashedMousePointerIcon,
    UploadIcon,
} from "lucide-react";
import Image from "next/image";
import { type Dispatch, Fragment, type SetStateAction, useEffect, useRef, useState } from "react";
import { componentDescriptors } from "@/lib/options";
import { useGuildStore } from "@/lib/stores/guild";
import { useShouldInspectStore } from "@/lib/stores/should-inspect";
import { useUserStore } from "@/lib/stores/user-store";
import { append, defaultComponents } from "@/lib/utils";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function EditorHeader({
    setComponents,
    components,
}: {
    setComponents: Dispatch<SetStateAction<APIMessageTopLevelComponent[]>>;
    components: APIMessageTopLevelComponent[];
}) {
    const { shouldInspect, setShouldInspect } = useShouldInspectStore();
    const { user } = useUserStore();
    const { setGuild } = useGuildStore();

    const [guilds, setGuilds] = useState<APIGuild[] | null>(null);
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

    return (
        <div className="flex justify-between gap-2 p-4 overflow-x-auto border-b border-dashed">
            <div className="flex gap-2 items-center">
                <Image
                    src="/logo.svg"
                    className="min-w-[30px] max-w-[30px] hidden md:block"
                    alt="Logo"
                    width={32}
                    height={32}
                />
                <Separator orientation="vertical" className="opacity-0 hidden md:block" />
                {user && (
                    <Select disabled={guilds === null} onValueChange={(value) => getAndSetGuild(value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={guilds === null ? "Loading guilds..." : "Select a guild"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="w-full flex justify-between">
                                    <span>Guilds</span>
                                    <button type="button" className="hover:text-foreground cursor-pointer">
                                        <RefreshCcwIcon size={14} />
                                    </button>
                                </SelectLabel>
                                {guilds &&
                                    [...guilds].map((guild, index) => {
                                        return (
                                            <SelectItem key={`${guild.name}-${index}`} value={guild.id}>
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
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={shouldInspect ? "secondary" : "ghost"}
                            size="icon"
                            onClick={() => {
                                setShouldInspect(!shouldInspect);
                            }}
                        >
                            <SquareDashedMousePointerIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Inspect</TooltipContent>
                </Tooltip>
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
                {/* <Button variant="ghost" size="icon" onClick={handleSaveMessage}>
                    <SaveIcon />
                </Button> */}
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
    );
}
