import {
    type APIContainerComponent,
    type APIMediaGalleryComponent,
    type APIMessageTopLevelComponent,
    type APISeparatorComponent,
    type APITextDisplayComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { BoxIcon, ImageIcon, PlusIcon, SeparatorHorizontalIcon, TextIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useOutputStore } from "@/lib/stores/output";
import Container from "./editor/container";
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

    const handleAddSeparator = () =>
        setComponents((previousComponents) => {
            const newComponents = [
                ...previousComponents,
                {
                    type: ComponentType.Separator,
                    spacing: SeparatorSpacingSize.Small,
                    divider: true,
                } as APISeparatorComponent,
            ];
            return newComponents;
        });

    const handleAddMediaGallery = () =>
        setComponents((previousComponents) => {
            const newComponents = [
                ...previousComponents,
                { type: ComponentType.MediaGallery, items: [] } as APIMediaGalleryComponent,
            ];
            return newComponents;
        });

    const handleAddContainer = () =>
        setComponents((previousComponents) => {
            const newComponents = [
                ...previousComponents,
                {
                    type: ComponentType.Container,
                    components: [],
                } as APIContainerComponent,
            ];
            return newComponents;
        });

    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className="flex flex-col gap-4">
                <Components components={components} setComponents={setComponents} />
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
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
                            <DropdownMenuItem onClick={handleAddContainer}>
                                <BoxIcon />
                                Container
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddSeparator}>
                                <SeparatorHorizontalIcon />
                                Separator
                            </DropdownMenuItem>
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
        setComponents((previousComponents) => {
            const newComponents = [...previousComponents];

            if (direction === "up" && index > 0) {
                [newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
            }

            if (direction === "down" && index < newComponents.length - 1) {
                [newComponents[index + 1], newComponents[index]] = [newComponents[index], newComponents[index + 1]];
            }

            return newComponents;
        });

    const handleRemove = (index: number) =>
        setComponents((previousComponents) => {
            const newComponents = [...previousComponents];
            newComponents.splice(index, 1);
            return newComponents;
        });

    return components.map((component, index) => {
        if (component.type === ComponentType.TextDisplay) {
            return (
                <TextDisplay
                    key={`${component.type}-${index}`}
                    content={component.content}
                    onContentChange={(content) =>
                        setComponents((previousComponents) => {
                            const newComponents = [...previousComponents];
                            (newComponents[index] as APITextDisplayComponent) = { ...component, content: content };
                            return newComponents;
                        })
                    }
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
                        setComponents((previousComponents) => {
                            const newComponents = [...previousComponents];
                            (newComponents[index] as APISeparatorComponent).spacing = size;
                            return newComponents;
                        });
                    }}
                    onChangeDivider={(value) => {
                        setComponents((previousComponents) => {
                            const newComponents = [...previousComponents];
                            (newComponents[index] as APISeparatorComponent).divider = value;
                            return newComponents;
                        });
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
                        setComponents((previousComponents) => {
                            const newComponents = [...previousComponents];
                            (newComponents[index] as APIMediaGalleryComponent).items = images;
                            return newComponents;
                        });
                    }}
                />
            );
        } else if (component.type === ComponentType.Container) {
            return (
                <Container
                    key={`${component.type}-${index}`}
                    onMoveUp={() => handleMove(index, "up")}
                    onMoveDown={() => handleMove(index, "down")}
                    onRemove={() => handleRemove(index)}
                    components={component.components}
                    setComponents={(childComponents) => {
                        setComponents((previousComponents) => {
                            const newComponents = [...previousComponents];
                            (newComponents[index] as APIContainerComponent).components = childComponents;
                            return newComponents;
                        });
                    }}
                />
            );
        }

        return null;
    });
}
