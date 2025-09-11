import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIContainerComponent,
    type APIFileComponent,
    type APIMediaGalleryComponent,
    type APIMessageTopLevelComponent,
    type APISeparatorComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { DownloadIcon, ImportIcon, PlusIcon, Redo2Icon, SaveIcon, Undo2Icon, UploadIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { generateRandomNumber } from "@/lib/random-number";
import { useOutputStore } from "@/lib/stores/output";
import { append, moveItem, removeAt, updateAt } from "@/lib/utils";
import { componentDescriptors } from "../lib/options";
import ButtonGroup from "./editor/button-group";
import Container from "./editor/container";
import File from "./editor/file";
import MediaGallery from "./editor/media-gallery";
import YesSeparator from "./editor/separator";
import TextDisplay from "./editor/text-display";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Editor() {
    const [components, setComponents] = useState<APIMessageTopLevelComponent[]>(exampleComponents);
    const { setOutput } = useOutputStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setOutput(components);
    }, [components, setOutput]);

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
        <div className="h-full overflow-y-auto">
            <div className="flex flex-col">
                <div className="flex justify-between gap-2 p-4 overflow-x-auto">
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center">
                            <Image
                                src="/logo.svg"
                                className="min-w-[30px] max-w-[30px]"
                                alt="Logo"
                                width={32}
                                height={32}
                            />
                            {/* <span className="ml-2.5 text-xl font-bold font-display md:block hidden">Message Kit</span> */}
                        </div>
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
                                    <DropdownMenuItem key={component.type} onClick={component.onClick}>
                                        <component.icon />
                                        {component.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Separator />
                <div className="p-4 flex flex-col gap-4">
                    <Components components={components} setComponents={setComponents} />
                </div>
            </div>
        </div>
    );
}

function Components({
    components,
    setComponents,
}: {
    components: APIMessageTopLevelComponent[];
    setComponents: Dispatch<SetStateAction<APIMessageTopLevelComponent[]>>;
}) {
    const handleMove = (index: number, direction: "up" | "down") =>
        setComponents((previousComponents) => moveItem(previousComponents, index, direction));

    const handleRemove = (index: number) => setComponents((previousComponents) => removeAt(previousComponents, index));

    return (
        <AnimatePresence>
            {components.map((component, index) => {
                if (component.type === ComponentType.TextDisplay) {
                    return (
                        <TextDisplay
                            key={component.id}
                            content={component.content}
                            onContentChange={(content) =>
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, () => ({ ...component, content: content })),
                                )
                            }
                            setAccessory={(accessory) =>
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, () => ({
                                        id: component.id,
                                        type: ComponentType.Section,
                                        components: [
                                            {
                                                type: ComponentType.TextDisplay,
                                                content: component.content,
                                            },
                                        ],
                                        accessory: accessory,
                                    })),
                                )
                            }
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                        />
                    );
                } else if (component.type === ComponentType.Section) {
                    return (
                        <TextDisplay
                            key={component.id}
                            content={component.components[0].content}
                            onContentChange={(content) =>
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, () => ({
                                        ...component,
                                        components: [{ ...component.components[0], content: content }],
                                    })),
                                )
                            }
                            accessory={component.accessory}
                            setAccessory={(accessory) =>
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, () => ({
                                        id: generateRandomNumber(),
                                        ...component,
                                        accessory: accessory,
                                    })),
                                )
                            }
                            removeAccessory={() =>
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, () => ({
                                        id: component.id,
                                        type: ComponentType.TextDisplay,
                                        content: component.components[0].content,
                                    })),
                                )
                            }
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                        />
                    );
                } else if (component.type === ComponentType.Separator) {
                    return (
                        <YesSeparator
                            key={component.id}
                            spacing={component.spacing ?? SeparatorSpacingSize.Small}
                            divider={component.divider ?? true}
                            onChangeSpacing={(size) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APISeparatorComponent),
                                        spacing: size,
                                    })),
                                );
                            }}
                            onChangeDivider={(value) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APISeparatorComponent),
                                        divider: value,
                                    })),
                                );
                            }}
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                        />
                    );
                } else if (component.type === ComponentType.MediaGallery) {
                    return (
                        <MediaGallery
                            key={component.id}
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                            images={component.items}
                            setImages={(images) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APIMediaGalleryComponent),
                                        items: images,
                                    })),
                                );
                            }}
                        />
                    );
                } else if (component.type === ComponentType.Container) {
                    return (
                        <Container
                            key={component.id}
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                            components={component.components}
                            setComponents={(childComponents) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APIContainerComponent),
                                        components: childComponents,
                                    })),
                                );
                            }}
                            color={component.accent_color ?? null}
                            setColor={(color) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APIContainerComponent),
                                        accent_color: color,
                                    })),
                                );
                            }}
                        />
                    );
                } else if (component.type === ComponentType.ActionRow) {
                    return (
                        <ButtonGroup
                            key={component.id}
                            components={component.components as APIButtonComponent[]}
                            setComponents={(components) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APIActionRowComponent<APIButtonComponent>),
                                        components: components,
                                    })),
                                );
                            }}
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                        />
                    );
                } else if (component.type === ComponentType.File) {
                    return (
                        <File
                            key={component.id}
                            onMoveUp={() => handleMove(index, "up")}
                            onMoveDown={() => handleMove(index, "down")}
                            onRemove={() => handleRemove(index)}
                            spoiler={component.spoiler ?? false}
                            onChangeSpoiler={(value) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APIFileComponent),
                                        spoiler: value,
                                    })),
                                );
                            }}
                            file={component}
                            setFile={(file) => {
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, (old) => ({
                                        ...(old as APIFileComponent),
                                        file: file.file,
                                    })),
                                );
                            }}
                        />
                    );
                }

                return null;
            })}
        </AnimatePresence>
    );
}

const exampleComponents = [
    {
        id: 272089724,
        type: 17,
        components: [
            {
                id: 542608968,
                type: 12,
                items: [
                    {
                        media: {
                            url: "https://use.messagekit.app/example-header.png",
                        },
                    },
                ],
            },
            {
                id: 720534108,
                type: 10,
                content:
                    "# Create rich and interactive mesages!\nThe easiest way to personalize your Discord server. We give you a simple editor, live preview, and flexible send options so you can focus on what you’re saying, not how to format it.",
            },
            {
                id: 506754460,
                type: 14,
                spacing: 1,
                divider: false,
            },
            {
                id: 238015939,
                type: 10,
                content:
                    '## Get started\n- Install Message Kit in your server.\n- Create a message. Click on "Add Component" to add various components to your message.\n- Send it! You can send your message via our bot or use webhooks. Note that you cannot send buttons that are able to trigger actions.',
            },
        ],
        accent_color: 4285144,
    },
    {
        id: 177701759,
        type: 1,
        components: [
            {
                id: 185764366,
                type: 2,
                label: "Support Server",
                style: 5,
                url: "https://discord.gg/5bBM2TVDD3",
            },
            {
                id: 294842992,
                type: 2,
                label: "Donate",
                style: 5,
                url: "https://ko-fi.com/ronykax",
            },
        ],
    },
];
