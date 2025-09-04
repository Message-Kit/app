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
import { append, moveItem, removeAt, updateAt } from "@/lib/utils";

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

    const componentsList = [
        {
            name: "Container",
            type: ComponentType.Container,
            icon: <BoxIcon />,
            onClick: () => addComponent<APIContainerComponent>({ type: ComponentType.Container, components: [] }),
        },
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
                            {componentsList.map((component) => (
                                <DropdownMenuItem key={component.type} onClick={component.onClick}>
                                    {component.icon}
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

    return components.map((component, index) => {
        if (component.type === ComponentType.TextDisplay) {
            return (
                <TextDisplay
                    key={`${component.type}-${index}`}
                    content={component.content}
                    onContentChange={(content) =>
                        setComponents((previousComponents) =>
                            updateAt(previousComponents, index, () => ({ ...component, content })),
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
                    key={`${component.type}-${index}`}
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
                    key={`${component.type}-${index}`}
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
                    key={`${component.type}-${index}`}
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
        }

        return null;
    });
}
