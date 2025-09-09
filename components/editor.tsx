import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIContainerComponent,
    type APIMediaGalleryComponent,
    type APIMessageTopLevelComponent,
    type APISeparatorComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { PlusIcon, Redo2Icon, RedoIcon, SaveIcon, SearchIcon, Undo2Icon, UndoIcon, UploadIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
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
import { Input } from "./ui/input";

export default function Editor() {
    const [components, setComponents] = useState<APIMessageTopLevelComponent[]>([]);
    const { setOutput } = useOutputStore();

    useEffect(() => {
        const handler = setTimeout(() => {
            setOutput(components);
        }, 100);

        return () => clearTimeout(handler);
    }, [components, setOutput]);

    const addComponent = <T extends APIMessageTopLevelComponent>(component: T) =>
        setComponents((previousComponents) => append(previousComponents, component));

    const componentsList = componentDescriptors.map((descriptor) => ({
        name: descriptor.name,
        type: descriptor.type,
        icon: descriptor.icon,
        onClick: () => addComponent(descriptor.create() as APIMessageTopLevelComponent),
    }));

    return (
        <div className="h-full overflow-y-auto">
            <div className="flex flex-col">
                <div className="flex justify-between gap-2 p-4">
                    <div className="flex gap-2">
                        <div className="relative">
                            <Input className="peer pe-9" placeholder="Search components" />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                                <SearchIcon size={16} aria-hidden="true" />
                            </div>
                        </div>
                        <Button variant={"outline"}>
                            <UploadIcon />
                            Upload
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                            <Undo2Icon />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Redo2Icon />
                        </Button>
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
                        />
                    );
                }

                return null;
            })}
        </AnimatePresence>
    );
}
