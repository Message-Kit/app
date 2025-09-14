import type { APIMessageTopLevelComponent } from "discord-api-types/v10";
import { DownloadIcon, PlusIcon, SaveIcon, SquareDashedMousePointerIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { type Dispatch, Fragment, type SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { componentDescriptors } from "@/lib/options";
import { useShouldInspectStore } from "@/lib/stores/should-inspect";
import { useUserStore } from "@/lib/stores/user-store";
import { append } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useUserStore();

    const [loadedMessages, setLoadedMessages] = useState<
        | {
              name: string;
              uid: string;
              components: APIMessageTopLevelComponent[];
              created_at: string;
              updated_at: string;
              id: string;
          }[]
        | null
    >(null);

    const addComponent = <T extends APIMessageTopLevelComponent>(component: T) =>
        setComponents((previousComponents) => append(previousComponents, component));

    const componentsList = componentDescriptors.map((descriptor) => ({
        name: descriptor.name,
        type: descriptor.type,
        icon: descriptor.icon,
        onClick: () => addComponent(descriptor.create() as APIMessageTopLevelComponent),
    }));

    useEffect(() => {
        if (!user) return;

        const run = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("uid", user.id)
                .order("updated_at", { ascending: false });

            if (data) {
                setLoadedMessages(data);
            } else if (error) {
                toast.error("There was an error loading your messages. Please try again.");
                console.error(error);
            }
        };

        run();
    }, [user]);

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

    async function handleSaveMessage() {
        if (!user) {
            toast.error("You must be logged in to save a message.");
            return;
        }

        const supabase = createClient();

        const { error } = await supabase.from("messages").insert({
            uid: user.id,
            components: components,
            updated_at: new Date().toISOString(),
            name: "Untitled",
        });

        if (error) {
            toast.error("There was an error saving your message. Please try again.");
            console.error(error);
        } else {
            toast.success("Message saved successfully!");
        }
    }

    return (
        <div className="flex justify-between gap-2 p-4 overflow-x-auto">
            <div className="flex gap-2 items-center">
                <Image
                    src="/logo.svg"
                    className="min-w-[30px] max-w-[30px] hidden md:block"
                    alt="Logo"
                    width={32}
                    height={32}
                />
                <Separator orientation="vertical" className="opacity-0 hidden md:block" />
                {user ? (
                    <Select
                        disabled={loadedMessages === null}
                        onValueChange={(name) => {
                            const message = loadedMessages?.find(
                                (m) => m.name.toLowerCase().replace(/\s+/g, "-") === name,
                            );
                            if (message) {
                                setComponents(message.components);
                            }
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue
                                placeholder={loadedMessages === null ? "Loading messages" : "Select a message"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {loadedMessages && loadedMessages.length > 0 ? (
                                loadedMessages.map((message, index) => (
                                    <SelectItem
                                        key={`${message.name}-${index}`}
                                        value={message.name.toLowerCase().replace(/\s+/g, "-")}
                                        // onClick={() => {
                                        //     setComponents(message.components);
                                        //     console.log(message.components);
                                        // }}
                                    >
                                        {message.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <span className="text-muted-foreground p-4 text-sm text-center">
                                    No messages found.
                                </span>
                            )}
                        </SelectContent>
                    </Select>
                ) : user === null ? null : (
                    user === undefined && <Skeleton className="w-[200px] h-9" />
                )}
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
                <Button variant="ghost" size="icon" onClick={handleSaveMessage}>
                    <SaveIcon />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>
                            <PlusIcon />
                            Add
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {componentsList.map((component, index) => (
                            <Fragment key={`${component.type}-${index}`}>
                                {component.name === "Buttons" && <DropdownMenuSeparator />}
                                <DropdownMenuItem onClick={component.onClick}>
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
