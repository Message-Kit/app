import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIComponentInContainer,
    type APIMediaGalleryComponent,
    type APISeparatorComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { PlusIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { generateRandomNumber } from "@/lib/random-number";
import { append, moveItem, removeAt, updateAt } from "@/lib/utils";
import { componentDescriptors } from "../../lib/options";
import NewBuilder from "../new-builder";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ButtonGroup from "./button-group";
import File from "./file";
import MediaGallery from "./media-gallery";
import Separator from "./separator";
import TextDisplay from "./text-display";

export default function Container({
    onMoveUp,
    onMoveDown,
    onRemove,
    components,
    setComponents,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    components: APIComponentInContainer[];
    setComponents: (components: APIComponentInContainer[]) => void;
}) {
    const handleMove = (index: number, direction: "up" | "down") => {
        setComponents(moveItem(components, index, direction));
    };

    const handleRemove = (index: number) => {
        setComponents(removeAt(components, index));
    };

    const addComponent = <T extends APIComponentInContainer>(component: T) => {
        setComponents(append(components, component));
    };

    const componentsList = componentDescriptors
        .filter((d) => d.type !== ComponentType.Container)
        .map((d) => ({
            name: d.name,
            type: d.type,
            icon: d.icon,
            onClick: () => addComponent(d.create() as APIComponentInContainer),
        }));

    return (
        <NewBuilder
            name="Container"
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
            extraButton={
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="h-7 text-xs font-semibold text-muted-foreground"
                        >
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
            }
        >
            <div className="flex flex-col gap-4">
                <AnimatePresence>
                    {components.map((component, index) => {
                        if (component.type === ComponentType.TextDisplay) {
                            return (
                                <TextDisplay
                                    key={component.id}
                                    content={component.content}
                                    onContentChange={(content) => {
                                        setComponents(updateAt(components, index, () => ({ ...component, content })));
                                    }}
                                    setAccessory={(accessory) => {
                                        setComponents(
                                            updateAt(components, index, () => ({
                                                id: generateRandomNumber(),
                                                type: ComponentType.Section,
                                                components: [
                                                    {
                                                        type: ComponentType.TextDisplay,
                                                        content: component.content,
                                                    },
                                                ],
                                                accessory,
                                            })),
                                        );
                                    }}
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
                                    onContentChange={(content) => {
                                        setComponents(
                                            updateAt(components, index, () => ({
                                                ...component,
                                                components: [{ ...component.components[0], content: content }],
                                            })),
                                        );
                                    }}
                                    accessory={component.accessory}
                                    setAccessory={(accessory) => {
                                        setComponents(
                                            updateAt(components, index, () => ({
                                                ...component,
                                                accessory,
                                            })),
                                        );
                                    }}
                                    removeAccessory={() =>
                                        setComponents(
                                            updateAt(components, index, () => ({
                                                type: ComponentType.TextDisplay,
                                                content: component.components[0].content,
                                                id: generateRandomNumber(),
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
                                        setComponents(
                                            updateAt(components, index, (old) => ({
                                                ...(old as APISeparatorComponent),
                                                spacing: size,
                                            })),
                                        );
                                    }}
                                    onChangeDivider={(value) => {
                                        setComponents(
                                            updateAt(components, index, (old) => ({
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
                                        setComponents(
                                            updateAt(components, index, (old) => ({
                                                ...(old as APIMediaGalleryComponent),
                                                items: images,
                                            })),
                                        );
                                    }}
                                />
                            );
                        } else if (component.type === ComponentType.ActionRow) {
                            return (
                                <ButtonGroup
                                    key={component.id}
                                    onMoveUp={() => handleMove(index, "up")}
                                    onMoveDown={() => handleMove(index, "down")}
                                    onRemove={() => handleRemove(index)}
                                    components={component.components as APIButtonComponent[]}
                                    setComponents={(actionRowComponents) =>
                                        setComponents(
                                            updateAt(components, index, (old) => ({
                                                ...(old as APIActionRowComponent<APIButtonComponent>),
                                                components: actionRowComponents,
                                            })),
                                        )
                                    }
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
            </div>
        </NewBuilder>
    );
}
