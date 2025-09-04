import {
    type APIComponentInContainer,
    type APIMediaGalleryComponent,
    type APISeparatorComponent,
    type APITextDisplayComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { ImageIcon, PlusIcon, SeparatorHorizontalIcon, TextIcon } from "lucide-react";
import NewBuilder from "../new-builder";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import MediaGallery from "./media-gallery";
import Separator from "./separator";
import TextDisplay from "./text-display";
import { append, moveItem, removeAt, updateAt } from "@/lib/utils";

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

    const componentsList = [
        {
            name: "Text Display",
            type: ComponentType.TextDisplay,
            icon: <TextIcon />,
            onClick: () => addComponent<APITextDisplayComponent>({ type: ComponentType.TextDisplay, content: "" }),
        },
        {
            name: "Media Gallery",
            type: ComponentType.MediaGallery,
            icon: <ImageIcon />,
            onClick: () => addComponent<APIMediaGalleryComponent>({ type: ComponentType.MediaGallery, items: [] }),
        },
        {
            name: "Separator",
            type: ComponentType.Separator,
            icon: <SeparatorHorizontalIcon />,
            onClick: () =>
                addComponent<APISeparatorComponent>({
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                }),
        },
    ];

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
                                {component.icon}
                                {component.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        >
            <div className="flex flex-col gap-4">
                {components.map((component, index) => {
                    if (component.type === ComponentType.TextDisplay) {
                        return (
                            <TextDisplay
                                key={`${component.type}-${index}`}
                                content={component.content}
                                onContentChange={(content) => {
                                    setComponents(updateAt(components, index, () => ({ ...component, content })));
                                }}
                                onMoveUp={() => handleMove(index, "up")}
                                onMoveDown={() => handleMove(index, "down")}
                                onRemove={() => handleRemove(index)}
                            />
                        );
                    } else if (component.type === ComponentType.Separator) {
                        return (
                            <Separator
                                key={`${component.type}-${index}`}
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
                                key={`${component.type}-${index}`}
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
                    }

                    return null;
                })}
                {components.length === 0 && (
                    <div className="text-muted-foreground text-sm flex items-center justify-center p-4">
                        Add a component to the container
                    </div>
                )}
            </div>
        </NewBuilder>
    );
}
