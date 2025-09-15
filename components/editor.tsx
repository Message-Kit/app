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
import { AnimatePresence } from "motion/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { generateRandomNumber } from "@/lib/random-number";
import { useOutputStore } from "@/lib/stores/output";
import { moveItem, removeAt, updateAt } from "@/lib/utils";
import ButtonGroup from "./editor/button-group";
import Container from "./editor/container";
import File from "./editor/file";
import MediaGallery from "./editor/media-gallery";
import YesSeparator from "./editor/separator";
import TextDisplay from "./editor/text-display";
import EditorHeader from "./editor-header";
import { Separator } from "./ui/separator";

export default function Editor() {
    const [components, setComponents] = useState<APIMessageTopLevelComponent[]>([]);
    const { setOutput } = useOutputStore();

    useEffect(() => {
        const saved = localStorage.getItem("output-json");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    setComponents(parsed);
                    return;
                }
            } catch {}
        }

        setComponents(defaultComponents);
    }, []);

    useEffect(() => {
        setOutput(components);
    }, [components, setOutput]);

    return (
        <div className="h-full overflow-y-auto">
            <div className="flex flex-col">
                <EditorHeader setComponents={setComponents} components={components} />
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
                            component={component}
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
                            component={component}
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
                            component={component}
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
                            component={component}
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
                            component={component}
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
                            component={component}
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
                            component={component}
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

const defaultComponents: APIMessageTopLevelComponent[] = [
    {
        id: 500528667,
        type: 10,
        content:
            "# Create modular, interactive messages 🧩\nMessage Kit lets you build **interactive** messages *fast*. You get a simple editor, live preview, and flexible send options so you can focus on what you're saying, not how to format it.",
    },
    {
        id: 869213619,
        type: 17,
        components: [
            {
                id: 843217988,
                type: 12,
                items: [
                    {
                        media: {
                            url: "https://messagekit.app/example-header.png",
                        },
                    },
                ],
            },
            {
                id: 280096184,
                type: 10,
                content:
                    "# Getting started\n- Install Message Kit in your server.\n- Click **Add Component** at the top of this pane and choose one.\n- Customize the component as you like.\n- Send it! You can send your message via our bot or with webhooks.",
            },
            {
                id: 674221493,
                type: 14,
                spacing: 1,
                divider: true,
            },
            {
                id: 781085487,
                type: 10,
                content: "-# Note: webhooks can't send buttons that trigger actions.",
            },
        ],
        accent_color: 5727743,
    },
    {
        id: 724873915,
        type: 1,
        components: [
            {
                id: 277957816,
                type: 2,
                label: "Support Server",
                style: 5,
                url: "https://discord.gg/5bBM2TVDD3",
            },
            {
                id: 172033159,
                type: 2,
                label: "Donate",
                style: 5,
                url: "https://ko-fi.com/ronykax",
            },
        ],
    },
];
