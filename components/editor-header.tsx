import { type APIMessageTopLevelComponent, ComponentType } from "discord-api-types/v10";
import { DownloadIcon, PlusIcon, SaveIcon, SquareDashedMousePointerIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { type Dispatch, Fragment, type SetStateAction, useRef } from "react";
import { componentDescriptors } from "@/lib/options";
import { useShouldInspectStore } from "@/lib/stores/should-inspect";
import { append } from "@/lib/utils";
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

    const addComponent = <T extends APIMessageTopLevelComponent>(component: T) =>
        setComponents((previousComponents) => append(previousComponents, component));

    const componentsList = componentDescriptors.map((descriptor) => ({
        name: descriptor.name,
        type: descriptor.type,
        icon: descriptor.icon,
        onClick: () => addComponent(descriptor.create() as APIMessageTopLevelComponent),
    }));

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
        <div className="flex justify-between gap-2 p-4 overflow-x-auto">
            <div className="flex gap-2 items-center">
                <Image src="/logo.svg" className="min-w-[30px] max-w-[30px]" alt="Logo" width={32} height={32} />
                <Separator orientation="vertical" className="opacity-0" />
                <Select defaultValue="untitled">
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a message" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="untitled">Untitled</SelectItem>
                    </SelectContent>
                </Select>
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
                <Button variant="ghost" size="icon">
                    <SaveIcon />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>
                            <PlusIcon />
                            Add Component
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {componentsList.map((component) => (
                            <Fragment key={component.type}>
                                {component.type === ComponentType.Separator && <DropdownMenuSeparator />}
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
