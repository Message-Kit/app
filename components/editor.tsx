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
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useOutputStore } from "@/lib/stores/output";
import { append, moveItem, removeAt, updateAt } from "@/lib/utils";
import { componentDescriptors } from "../lib/options";
import ButtonGroup from "./editor/button-group";
import Container from "./editor/container";
import File from "./editor/file";
import MediaGallery from "./editor/media-gallery";
import Separator from "./editor/separator";
import TextDisplay from "./editor/text-display";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
        <div className="p-4 h-full overflow-y-auto">
            <div className="flex flex-col gap-4">
                <Components components={components} setComponents={setComponents} />
                <div className="flex justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <motion.div layout="position" transition={{ duration: 0.1 }}>
                                <Button>
                                    <PlusIcon />
                                    Add Component
                                </Button>
                            </motion.div>
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
                                        ...component,
                                        accessory: accessory,
                                    })),
                                )
                            }
                            removeAccessory={() =>
                                setComponents((previousComponents) =>
                                    updateAt(previousComponents, index, () => ({
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
                        <Separator
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
