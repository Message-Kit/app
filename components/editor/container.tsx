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
        const newComponents = [...components];

        if (direction === "up" && index > 0) {
            [newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
        }

        if (direction === "down" && index < newComponents.length - 1) {
            [newComponents[index + 1], newComponents[index]] = [newComponents[index], newComponents[index + 1]];
        }

        setComponents(newComponents);
    };

    const handleRemove = (index: number) => {
        const newComponents = [...components];
        newComponents.splice(index, 1);
        setComponents(newComponents);
    };

    const handleAddTextDisplay = () => {
        const newComponents = [
            ...components,
            {
                type: ComponentType.TextDisplay,
                content: "",
            } as APITextDisplayComponent,
        ];
        setComponents(newComponents);
    };

    const handleAddSeparator = () => {
        const newComponents = [
            ...components,
            {
                type: ComponentType.Separator,
                spacing: SeparatorSpacingSize.Small,
                divider: true,
            } as APISeparatorComponent,
        ];
        setComponents(newComponents);
    };

    const handleAddMediaGallery = () => {
        const newComponents = [
            ...components,
            { type: ComponentType.MediaGallery, items: [] } as APIMediaGalleryComponent,
        ];
        setComponents(newComponents);
    };

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
                        <DropdownMenuItem onClick={handleAddTextDisplay}>
                            <TextIcon />
                            Text Display
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAddMediaGallery}>
                            <ImageIcon />
                            Media Gallery
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAddSeparator}>
                            <SeparatorHorizontalIcon />
                            Separator
                        </DropdownMenuItem>
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
                                    const newComponents = [...components];
                                    (newComponents[index] as APITextDisplayComponent) = { ...component, content };
                                    setComponents(newComponents);
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
                                    const newComponents = [...components];
                                    (newComponents[index] as APISeparatorComponent).spacing = size;
                                    setComponents(newComponents);
                                }}
                                onChangeDivider={(value) => {
                                    const newComponents = [...components];
                                    (newComponents[index] as APISeparatorComponent).divider = value;
                                    setComponents(newComponents);
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
                                    const newComponents = [...components];
                                    (newComponents[index] as APIMediaGalleryComponent).items = images;
                                    setComponents(newComponents);
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
