"use client";

import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIComponentInContainer,
    type APIComponentInMessageActionRow,
    type APIContainerComponent,
    type APIMessageTopLevelComponent,
    type APITextDisplayComponent,
    ComponentType,
    RESTAPIAttachment,
    type RESTPostAPIChannelMessageJSONBody,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import {
    BoxIcon,
    DownloadIcon,
    FileIcon,
    ImageIcon,
    ImportIcon,
    MousePointerClickIcon,
    PlusIcon,
    RectangleEllipsisIcon,
    SaveIcon,
    Send,
    SeparatorHorizontalIcon,
    TextIcon,
    UploadIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Alert from "@/components/alert";
import NewButtonGroup from "@/components/builders/new-button-group";
import NewContainer from "@/components/builders/new-container";
import NewTextDisplay from "@/components/builders/new-text-display";
import DiscordSeparator from "@/components/builders/separator";
import ChannelSelector from "@/components/channel-selector";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Template } from "@/types/db";
import { createClient } from "@/utils/supabase/client";
import { sendMessageToDiscord } from "./actions";
import { moveChildDown, moveChildUp, moveTopLevelDown, moveTopLevelUp } from "./utils";
import MediaGallery from "@/components/builders/media-gallery";

export default function Page() {
    const params = useParams();
    const supabase = createClient();

    const [data, setData] = useState<Template | null>(null);
    const [result, setResult] = useState<{ success: boolean; message: string | string[] } | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<string>("");
    const [importFile, setImportFile] = useState<File | null>(null);

    const [components, setComponents] = useState<NonNullable<RESTPostAPIChannelMessageJSONBody["components"]>>([]);
    const [attachments, setAttachments] = useState<RESTAPIAttachment[]>([]);

    const keyMapRef = useRef(new WeakMap<object, string>());
    const nextIdRef = useRef(0);

    const getKey = (o: object) => {
        const map = keyMapRef.current;
        const existing = map.get(o);
        if (existing) return existing;
        const k = `k${nextIdRef.current++}`;
        map.set(o, k);
        return k;
    };

    useEffect(() => {
        supabase
            .from("templates")
            .select("*")
            .eq("id", params.message)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    console.log(error);
                } else {
                    setData(data);
                    setComponents(data.body ?? []);
                }
            });
    }, [params.message, supabase]);

    if (!data) {
        return (
            <div className="p-4 flex justify-center items-center size-full">
                <Spinner size={"medium"} />
            </div>
        );
    }

    if (components.length === 0) {
        return (
            <div className="p-4 flex justify-center items-center size-full">
                <div className="flex flex-col gap-2 items-center">
                    <div className="text-2xl font-bold font-display">It's empty in here...</div>
                    <div className="text-sm text-muted-foreground">Add a component to get started.</div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mt-8" asChild>
                            <Button>
                                <PlusIcon />
                                Add Component
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() =>
                                    setComponents((prev) => [
                                        ...prev,
                                        {
                                            type: ComponentType.TextDisplay,
                                            content: "",
                                        },
                                    ])
                                }
                            >
                                <TextIcon />
                                Text Display
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    setComponents((prev) => [
                                        ...prev,
                                        {
                                            type: ComponentType.Container,
                                            components: [],
                                        },
                                    ])
                                }
                            >
                                <BoxIcon />
                                Container
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    setComponents((prev) => [...prev, { type: ComponentType.MediaGallery, items: [] }])
                                }
                            >
                                <ImageIcon />
                                Media Gallery
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FileIcon />
                                File
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    setComponents((prev) => [
                                        ...prev,
                                        {
                                            type: ComponentType.Separator,
                                            divider: true,
                                            spacing: SeparatorSpacingSize.Large,
                                        },
                                    ])
                                }
                            >
                                <SeparatorHorizontalIcon />
                                Separator
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    setComponents((prev) => [
                                        ...prev,
                                        {
                                            type: ComponentType.ActionRow,
                                            components: [],
                                        },
                                    ])
                                }
                            >
                                <MousePointerClickIcon />
                                Button Group
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    setComponents((prev) => [
                                        ...prev,
                                        {
                                            type: ComponentType.ActionRow,
                                            components: [],
                                        },
                                    ])
                                }
                            >
                                <RectangleEllipsisIcon />
                                Dropdown Menu
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        );
    }

    const handleSendMessage = async () => {
        await sendMessageToDiscord(
            {
                components: components,
                // attachments: attachments
            },
            selectedChannel,
        )
            .then(() => {
                setResult(null);
            })
            .catch((error) => {
                console.log(error);
                setResult({ success: false, message: (error.message as string).split("\n").slice(1) });
            });
    };

    const handleSaveMessage = async () => {
        supabase
            .from("templates")
            .update({
                updated_at: new Date().toISOString(),
                body: {
                    components: components,
                    attachments: attachments,
                },
            })
            .eq("id", params.message)
            .select("*")
            .then(({ data, error }) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                }
            });
    };

    const handleImportMessage = async () => {
        if (!importFile) return;
        setComponents(JSON.parse(await importFile.text()).components);
        setAttachments(JSON.parse(await importFile.text()).attachments);
    };

    function handleExportMessage() {
        const blob = new Blob([JSON.stringify({ components: components, attachments: attachments }, null, 2)], {
            type: "application/json",
        });

        return URL.createObjectURL(blob);
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={61.5}>
                <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
                    {result && <Alert title="Something went wrong!" description={result.message} />}

                    <ComponentsList
                        components={components}
                        setComponents={setComponents}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        guildId={params.guild as string}
                        getKey={getKey}
                    />

                    <div className="flex justify-between gap-2">
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"outline"}>
                                        <PlusIcon />
                                        Add Component
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setComponents((prev) => [
                                                ...prev,
                                                {
                                                    type: ComponentType.TextDisplay,
                                                    content: "",
                                                },
                                            ])
                                        }
                                    >
                                        <TextIcon />
                                        Text Display
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setComponents((prev) => [
                                                ...prev,
                                                {
                                                    type: ComponentType.Container,
                                                    components: [],
                                                },
                                            ])
                                        }
                                    >
                                        <BoxIcon />
                                        Container
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setComponents((prev) => [
                                                ...prev,
                                                { type: ComponentType.MediaGallery, items: [] },
                                            ])
                                        }
                                    >
                                        <ImageIcon />
                                        Media Gallery
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileIcon />
                                        File
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setComponents((prev) => [
                                                ...prev,
                                                {
                                                    type: ComponentType.Separator,
                                                    divider: true,
                                                    spacing: SeparatorSpacingSize.Large,
                                                },
                                            ]);
                                        }}
                                    >
                                        <SeparatorHorizontalIcon />
                                        Separator
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setComponents((prev) => [
                                                ...prev,
                                                {
                                                    type: ComponentType.ActionRow,
                                                    components: [],
                                                },
                                            ])
                                        }
                                    >
                                        <MousePointerClickIcon />
                                        Button Group
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setComponents((prev) => [
                                                ...prev,
                                                {
                                                    type: ComponentType.ActionRow,
                                                    components: [],
                                                },
                                            ])
                                        }
                                    >
                                        <RectangleEllipsisIcon />
                                        Dropdown Menu
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" onClick={handleSaveMessage}>
                                <SaveIcon />
                                Save
                            </Button>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant={"outline"}>
                                            <DownloadIcon />
                                            Import
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Import Message</DialogTitle>
                                            <DialogDescription>Import a message from a file.</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="import-message-file">File</Label>
                                            <Input
                                                accept=".json"
                                                type="file"
                                                id="import-message-file"
                                                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant={"outline"}>Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={handleImportMessage}>Confirm</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant={"outline"}>
                                            <UploadIcon />
                                            Export
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Export Message</DialogTitle>
                                            <DialogDescription>Export a message to a file.</DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant={"outline"}>Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button asChild>
                                                    <a href={handleExportMessage()} download={`${params.message}.json`}>
                                                        Download
                                                    </a>
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {components.length > 0 && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Send />
                                            Send Message
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Send Options</DialogTitle>
                                            <DialogDescription>Choose how to send this message.</DialogDescription>
                                        </DialogHeader>
                                        <Tabs defaultValue="bot">
                                            <TabsList className="w-full mb-4">
                                                <TabsTrigger value="bot">Bot</TabsTrigger>
                                                <TabsTrigger value="webhook">Webhook</TabsTrigger>
                                                <TabsTrigger value="server" disabled>
                                                    Server
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="bot">
                                                <div className="w-full flex flex-col gap-2">
                                                    <Label>Channel</Label>
                                                    <ChannelSelector
                                                        setSelectedChannel={setSelectedChannel}
                                                        guildId={params.guild as string}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Send through the Message Kit app
                                                    </p>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="webhook">
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="webhook-url">Webhook URL</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter your webhook URL"
                                                        id="webhook-url"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Click here if you don't have a webhook URL
                                                    </p>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="server">
                                                <div className="flex flex-col gap-6"></div>
                                            </TabsContent>
                                        </Tabs>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant={"outline"}>Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={handleSendMessage}>Confirm</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={38.5}>
                <div className="p-4 flex justify-center items-center h-full text-muted-foreground">
                    No Preview Available
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

function ComponentsList({
    components,
    setComponents,
    attachments,
    setAttachments,
    guildId,
    getKey,
}: {
    components: NonNullable<RESTPostAPIChannelMessageJSONBody["components"]>;
    setComponents: Dispatch<SetStateAction<NonNullable<RESTPostAPIChannelMessageJSONBody["components"]>>>;
    attachments: RESTAPIAttachment[];
    setAttachments: Dispatch<SetStateAction<RESTAPIAttachment[]>>;
    guildId: string;
    getKey: (o: object) => string;
}) {
    return (
        <div className="flex flex-col gap-4">
            {components.map((component, index) => {
                if (component.type === ComponentType.TextDisplay) {
                    return (
                        <NewTextDisplay
                            key={getKey(component)}
                            guildId={guildId}
                            value={component.content ?? ""}
                            onChange={(next) => {
                                setComponents((prev) => {
                                    const arr = [...prev];
                                    const item = arr[index] as APITextDisplayComponent;
                                    item.content = next;
                                    return arr;
                                });
                            }}
                            accessory={null}
                            onChangeAccessory={(next, currentValue) => {
                                if (!next) return;
                                setComponents((prev) => {
                                    const nextArr = [...prev];
                                    const text = nextArr[index] as APITextDisplayComponent;
                                    nextArr[index] = {
                                        type: ComponentType.Section,
                                        components: [
                                            {
                                                type: ComponentType.TextDisplay,
                                                content: currentValue ?? text.content ?? "",
                                            } as APITextDisplayComponent,
                                        ],
                                        accessory: next,
                                    } as APIMessageTopLevelComponent;
                                    return nextArr;
                                });
                            }}
                            onMoveUp={() => setComponents((prev) => moveTopLevelUp(prev, index))}
                            onMoveDown={() => setComponents((prev) => moveTopLevelDown(prev, index))}
                            onDelete={() => {
                                setComponents((prev) => prev.filter((_, i) => i !== index));
                            }}
                        />
                    );
                } else if (component.type === ComponentType.MediaGallery) {
                    return (
                        <MediaGallery
                            key={getKey(component)}
                            attachments={attachments ?? []}
                            setAttachments={setAttachments}
                            onMoveUp={() => setComponents((prev) => moveTopLevelUp(prev, index))}
                            onMoveDown={() => setComponents((prev) => moveTopLevelDown(prev, index))}
                            onDelete={() => {
                                setComponents((prev) => prev.filter((_, i) => i !== index));
                            }}
                        />
                    );
                } else if (component.type === ComponentType.Section) {
                    const section = component as {
                        type: ComponentType.Section;
                        components: [APITextDisplayComponent];
                        accessory?:
                            | APIButtonComponent
                            | {
                                  type: ComponentType.Thumbnail;
                                  media: { url: string };
                                  description?: string;
                              };
                    };
                    const child = (section.components?.[0] ?? {}) as APITextDisplayComponent;
                    return (
                        <NewTextDisplay
                            key={getKey(component)}
                            guildId={guildId}
                            value={child?.content ?? ""}
                            onChange={(next) => {
                                setComponents((prev) => {
                                    const arr = [...prev];
                                    const s = arr[index] as {
                                        type: ComponentType.Section;
                                        components: [APITextDisplayComponent];
                                        accessory?:
                                            | APIButtonComponent
                                            | {
                                                  type: ComponentType.Thumbnail;
                                                  media: { url: string };
                                                  description?: string;
                                              };
                                    };
                                    const children = [...(s.components ?? [])];
                                    if (children[0] && children[0].type === ComponentType.TextDisplay) {
                                        children[0] = {
                                            ...(children[0] as APITextDisplayComponent),
                                            content: next,
                                        };
                                    }
                                    s.components = [
                                        (children[0] as APITextDisplayComponent) ??
                                            ({
                                                type: ComponentType.TextDisplay,
                                                content: "",
                                            } as APITextDisplayComponent),
                                    ];
                                    arr[index] = s as APIMessageTopLevelComponent;
                                    return arr;
                                });
                            }}
                            accessory={section.accessory ?? null}
                            onChangeAccessory={(nextAcc, currentValue) => {
                                setComponents((prev) => {
                                    const arr = [...prev];
                                    const s = arr[index] as {
                                        type: ComponentType.Section;
                                        components: [APITextDisplayComponent];
                                        accessory?:
                                            | APIButtonComponent
                                            | {
                                                  type: ComponentType.Thumbnail;
                                                  media: { url: string };
                                                  description?: string;
                                              };
                                    };
                                    if (!nextAcc) {
                                        const textChild = (s.components?.[0] ?? {}) as APITextDisplayComponent;
                                        arr[index] = {
                                            type: ComponentType.TextDisplay,
                                            content: currentValue ?? textChild?.content ?? "",
                                        } as APIMessageTopLevelComponent;
                                        return arr;
                                    }
                                    arr[index] = {
                                        ...s,
                                        accessory: nextAcc,
                                    } as APIMessageTopLevelComponent;
                                    return arr;
                                });
                            }}
                            onMoveUp={() => setComponents((prev) => moveTopLevelUp(prev, index))}
                            onMoveDown={() => setComponents((prev) => moveTopLevelDown(prev, index))}
                            onDelete={() => {
                                setComponents((prev) => prev.filter((_, i) => i !== index));
                            }}
                        />
                    );
                } else if (component.type === ComponentType.Container) {
                    return (
                        <NewContainer
                            key={getKey(component)}
                            onMoveUp={() => setComponents((prev) => moveTopLevelUp(prev, index))}
                            onMoveDown={() => setComponents((prev) => moveTopLevelDown(prev, index))}
                            onDelete={() => {
                                setComponents((prev) => prev.filter((_, i) => i !== index));
                            }}
                            addTrigger={
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="font-body font-semibold underline underline-offset-2 px-2 text-muted-foreground hover:text-primary-foreground text-xs"
                                        >
                                            Add Component
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setComponents((prev) => {
                                                    const next = [...prev];
                                                    const container = next[index] as APIContainerComponent;
                                                    const children = [...container.components];
                                                    children.push({
                                                        type: ComponentType.TextDisplay,
                                                        content: "",
                                                    });
                                                    next[index] = {
                                                        ...container,
                                                        components: children,
                                                    };
                                                    return next;
                                                })
                                            }
                                        >
                                            <TextIcon />
                                            Text Display
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setComponents((prev) => {
                                                    const next = [...prev];
                                                    const container = next[index] as APIContainerComponent;
                                                    const children = [...container.components];
                                                    children.push({ type: ComponentType.MediaGallery, items: [] });
                                                    next[index] = { ...container, components: children };
                                                    return next;
                                                })
                                            }
                                        >
                                            <ImageIcon />
                                            Media Gallery
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <FileIcon />
                                            File
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setComponents((prev) => {
                                                    const next = [...prev];
                                                    const container = next[index] as APIContainerComponent;
                                                    const children = [...container.components];
                                                    children.push({
                                                        type: ComponentType.Separator,
                                                        divider: true,
                                                        spacing: SeparatorSpacingSize.Large,
                                                    });
                                                    next[index] = {
                                                        ...container,
                                                        components: children,
                                                    };
                                                    return next;
                                                })
                                            }
                                        >
                                            <SeparatorHorizontalIcon />
                                            Separator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setComponents((prev) => {
                                                    const next = [...prev];
                                                    const container = next[index] as APIContainerComponent;
                                                    const children = [...container.components];
                                                    children.push({
                                                        type: ComponentType.ActionRow,
                                                        components: [],
                                                    });
                                                    next[index] = {
                                                        ...container,
                                                        components: children,
                                                    };
                                                    return next;
                                                })
                                            }
                                        >
                                            <MousePointerClickIcon />
                                            Button Group
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setComponents((prev) => {
                                                    const next = [...prev];
                                                    const container = next[index] as APIContainerComponent;
                                                    const children = [...container.components];
                                                    children.push({
                                                        type: ComponentType.ActionRow,
                                                        components: [],
                                                    });
                                                    next[index] = {
                                                        ...container,
                                                        components: children,
                                                    };
                                                    return next;
                                                })
                                            }
                                        >
                                            <RectangleEllipsisIcon />
                                            Dropdown Menu
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            }
                        >
                            {component.components.length <= 0 ? (
                                <div className="text-muted-foreground text-sm items-center flex justify-center">
                                    Add a component to this container to get started.
                                </div>
                            ) : (
                                component.components.map((child, childIndex) => {
                                    if (child.type === ComponentType.TextDisplay) {
                                        return (
                                            <NewTextDisplay
                                                key={getKey(child)}
                                                guildId={guildId}
                                                value={child.content ?? ""}
                                                onChange={(next) => {
                                                    setComponents((prev) => {
                                                        const arr = [...prev];
                                                        const container = arr[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const childItem = children[
                                                            childIndex
                                                        ] as APITextDisplayComponent;
                                                        childItem.content = next;
                                                        container.components = children;
                                                        arr[index] = container;
                                                        return arr;
                                                    });
                                                }}
                                                accessory={null}
                                                onChangeAccessory={(nextAcc, currentValue) => {
                                                    if (!nextAcc) return;
                                                    setComponents((prev) => {
                                                        const arr = [...prev];
                                                        const container = arr[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const textChild = children[
                                                            childIndex
                                                        ] as APITextDisplayComponent;
                                                        const section = {
                                                            type: ComponentType.Section,
                                                            components: [
                                                                {
                                                                    type: ComponentType.TextDisplay,
                                                                    content: currentValue ?? textChild.content ?? "",
                                                                } as APITextDisplayComponent,
                                                            ],
                                                            accessory: nextAcc,
                                                        } as APIComponentInContainer;
                                                        children[childIndex] = section as APIComponentInContainer;
                                                        (arr[index] as APIContainerComponent).components = children;
                                                        return arr;
                                                    });
                                                }}
                                                onMoveUp={() =>
                                                    setComponents((prev) => moveChildUp(prev, index, childIndex))
                                                }
                                                onMoveDown={() =>
                                                    setComponents((prev) => moveChildDown(prev, index, childIndex))
                                                }
                                                onDelete={() => {
                                                    setComponents((prev) =>
                                                        prev.map((c, i) =>
                                                            i === index && c.type === ComponentType.Container
                                                                ? {
                                                                      ...c,
                                                                      components: (c.components ?? []).filter(
                                                                          (_, ci) => ci !== childIndex,
                                                                      ),
                                                                  }
                                                                : c,
                                                        ),
                                                    );
                                                }}
                                            />
                                        );
                                    } else if (child.type === ComponentType.MediaGallery) {
                                        return (
                                            <MediaGallery
                                                key={getKey(child)}
                                                attachments={attachments ?? []}
                                                setAttachments={setAttachments}
                                                onMoveUp={() =>
                                                    setComponents((prev) => moveChildUp(prev, index, childIndex))
                                                }
                                                onMoveDown={() =>
                                                    setComponents((prev) => moveChildDown(prev, index, childIndex))
                                                }
                                                onDelete={() =>
                                                    setComponents((prev) =>
                                                        prev.map((c, i) =>
                                                            i === index && c.type === ComponentType.Container
                                                                ? {
                                                                      ...c,
                                                                      components: (c.components ?? []).filter(
                                                                          (_, ci) => ci !== childIndex,
                                                                      ),
                                                                  }
                                                                : c,
                                                        ),
                                                    )
                                                }
                                            />
                                        );
                                    } else if (child.type === ComponentType.Section) {
                                        const section = child as {
                                            type: ComponentType.Section;
                                            components: [APITextDisplayComponent];
                                            accessory?:
                                                | APIButtonComponent
                                                | {
                                                      type: ComponentType.Thumbnail;
                                                      media: { url: string };
                                                      description?: string;
                                                  };
                                        };
                                        const textChild = (section.components?.[0] ?? {}) as APITextDisplayComponent;
                                        return (
                                            <NewTextDisplay
                                                key={getKey(child)}
                                                guildId={guildId}
                                                value={textChild?.content ?? ""}
                                                onChange={(next) => {
                                                    setComponents((prev) => {
                                                        const arr = [...prev];
                                                        const container = arr[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const s = children[childIndex] as {
                                                            type: ComponentType.Section;
                                                            components: [APITextDisplayComponent];
                                                            accessory?:
                                                                | APIButtonComponent
                                                                | {
                                                                      type: ComponentType.Thumbnail;
                                                                      media: { url: string };
                                                                      description?: string;
                                                                  };
                                                        };
                                                        const inner = [...(s.components ?? [])];
                                                        if (inner[0] && inner[0].type === ComponentType.TextDisplay) {
                                                            inner[0] = {
                                                                ...(inner[0] as APITextDisplayComponent),
                                                                content: next,
                                                            };
                                                        }
                                                        s.components = [
                                                            (inner[0] as APITextDisplayComponent) ??
                                                                ({
                                                                    type: ComponentType.TextDisplay,
                                                                    content: "",
                                                                } as APITextDisplayComponent),
                                                        ];
                                                        children[childIndex] = s as APIComponentInContainer;
                                                        (arr[index] as APIContainerComponent).components = children;
                                                        return arr;
                                                    });
                                                }}
                                                accessory={section.accessory ?? null}
                                                onChangeAccessory={(nextAcc, currentValue) => {
                                                    setComponents((prev) => {
                                                        const arr = [...prev];
                                                        const container = arr[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const s = children[childIndex] as {
                                                            type: ComponentType.Section;
                                                            components: [APITextDisplayComponent];
                                                            accessory?:
                                                                | APIButtonComponent
                                                                | {
                                                                      type: ComponentType.Thumbnail;
                                                                      media: { url: string };
                                                                      description?: string;
                                                                  };
                                                        };
                                                        if (!nextAcc) {
                                                            const textOnly = (s.components?.[0] ??
                                                                {}) as APITextDisplayComponent;
                                                            children[childIndex] = {
                                                                type: ComponentType.TextDisplay,
                                                                content: currentValue ?? textOnly?.content ?? "",
                                                            } as APIComponentInContainer;
                                                        } else {
                                                            children[childIndex] = {
                                                                ...s,
                                                                accessory: nextAcc,
                                                            } as APIComponentInContainer;
                                                        }
                                                        (arr[index] as APIContainerComponent).components = children;
                                                        return arr;
                                                    });
                                                }}
                                                onMoveUp={() =>
                                                    setComponents((prev) => moveChildUp(prev, index, childIndex))
                                                }
                                                onMoveDown={() =>
                                                    setComponents((prev) => moveChildDown(prev, index, childIndex))
                                                }
                                                onDelete={() => {
                                                    setComponents((prev) =>
                                                        prev.map((c, i) =>
                                                            i === index && c.type === ComponentType.Container
                                                                ? {
                                                                      ...c,
                                                                      components: (c.components ?? []).filter(
                                                                          (_, ci) => ci !== childIndex,
                                                                      ),
                                                                  }
                                                                : c,
                                                        ),
                                                    );
                                                }}
                                            />
                                        );
                                    } else if (child.type === ComponentType.ActionRow) {
                                        return (
                                            <NewButtonGroup
                                                key={getKey(child)}
                                                guildId={guildId}
                                                buttons={child.components}
                                                onChangeButtons={(nextButtons) => {
                                                    setComponents((prev) => {
                                                        const next = [...prev];
                                                        const container = next[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const row = children[
                                                            childIndex
                                                        ] as APIActionRowComponent<APIComponentInMessageActionRow>;
                                                        children[childIndex] = {
                                                            ...row,
                                                            components: nextButtons,
                                                        } as APIActionRowComponent<APIComponentInMessageActionRow>;
                                                        next[index] = {
                                                            ...container,
                                                            components: children,
                                                        };
                                                        return next;
                                                    });
                                                }}
                                                onMoveUp={() =>
                                                    setComponents((prev) => moveChildUp(prev, index, childIndex))
                                                }
                                                onMoveDown={() =>
                                                    setComponents((prev) => moveChildDown(prev, index, childIndex))
                                                }
                                                onDelete={() => {
                                                    setComponents((prev) =>
                                                        prev.map((c, i) =>
                                                            i === index && c.type === ComponentType.Container
                                                                ? {
                                                                      ...c,
                                                                      components: (c.components ?? []).filter(
                                                                          (_, ci) => ci !== childIndex,
                                                                      ),
                                                                  }
                                                                : c,
                                                        ),
                                                    );
                                                }}
                                            />
                                        );
                                    } else if (child.type === ComponentType.Separator) {
                                        const sepChild = child as {
                                            type: ComponentType.Separator;
                                            divider: boolean;
                                            spacing: SeparatorSpacingSize;
                                        };
                                        return (
                                            <DiscordSeparator
                                                key={getKey(child)}
                                                onMoveUp={() =>
                                                    setComponents((prev) => moveChildUp(prev, index, childIndex))
                                                }
                                                onMoveDown={() =>
                                                    setComponents((prev) => moveChildDown(prev, index, childIndex))
                                                }
                                                onDelete={() => {
                                                    setComponents((prev) =>
                                                        prev.map((c, i) =>
                                                            i === index && c.type === ComponentType.Container
                                                                ? {
                                                                      ...c,
                                                                      components: (c.components ?? []).filter(
                                                                          (_, ci) => ci !== childIndex,
                                                                      ),
                                                                  }
                                                                : c,
                                                        ),
                                                    );
                                                }}
                                                spacing={sepChild.spacing}
                                                divider={sepChild.divider}
                                                onChangeSpacing={(size) =>
                                                    setComponents((prev) => {
                                                        const arr = [...prev];
                                                        const container = arr[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const current = children[childIndex] as {
                                                            type: ComponentType.Separator;
                                                            divider: boolean;
                                                            spacing: SeparatorSpacingSize;
                                                        };
                                                        children[childIndex] = {
                                                            ...current,
                                                            spacing: size,
                                                        } as APIComponentInContainer;
                                                        (arr[index] as APIContainerComponent).components = children;
                                                        return arr;
                                                    })
                                                }
                                                onChangeDivider={(value) =>
                                                    setComponents((prev) => {
                                                        const arr = [...prev];
                                                        const container = arr[index] as APIContainerComponent;
                                                        const children = [...container.components];
                                                        const current = children[childIndex] as {
                                                            type: ComponentType.Separator;
                                                            divider: boolean;
                                                            spacing: SeparatorSpacingSize;
                                                        };
                                                        children[childIndex] = {
                                                            ...current,
                                                            divider: value,
                                                        } as APIComponentInContainer;
                                                        (arr[index] as APIContainerComponent).components = children;
                                                        return arr;
                                                    })
                                                }
                                            />
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </NewContainer>
                    );
                } else if (component.type === ComponentType.ActionRow) {
                    return (
                        <NewButtonGroup
                            key={getKey(component)}
                            guildId={guildId}
                            onChangeButtons={(nextButtons) => {
                                setComponents((prev) => {
                                    const next = [...prev];
                                    const row = next[index] as APIActionRowComponent<APIComponentInMessageActionRow>;
                                    next[index] = {
                                        ...row,
                                        components: nextButtons,
                                    } as APIActionRowComponent<APIComponentInMessageActionRow>;
                                    return next;
                                });
                            }}
                            onMoveUp={() => {
                                setComponents((prev) => {
                                    if (index === 0) return prev;
                                    const next = [...prev];
                                    const item = next[index];
                                    const prevItem = next[index - 1];
                                    if (prevItem.type === ComponentType.Container) {
                                        const container = prevItem as APIContainerComponent;
                                        next.splice(index, 1);
                                        const moved = item as APIActionRowComponent<APIComponentInMessageActionRow>;
                                        const updated = {
                                            ...container,
                                            components: [...container.components, moved],
                                        };
                                        next[index - 1] = updated;
                                        return next;
                                    }
                                    next[index] = next[index - 1];
                                    next[index - 1] = item;
                                    return next;
                                });
                            }}
                            onMoveDown={() => {
                                setComponents((prev) => {
                                    const lastIndex = prev.length - 1;
                                    if (index === lastIndex) return prev;
                                    const next = [...prev];
                                    const item = next[index];
                                    const nextItem = next[index + 1];
                                    if (nextItem.type === ComponentType.Container) {
                                        const container = nextItem as APIContainerComponent;
                                        next.splice(index, 1);
                                        const moved = item as APIActionRowComponent<APIComponentInMessageActionRow>;
                                        const updated = {
                                            ...container,
                                            components: [moved, ...container.components],
                                        };
                                        next[index] = updated;
                                        return next;
                                    }
                                    next[index] = nextItem;
                                    next[index + 1] = item;
                                    return next;
                                });
                            }}
                            onDelete={() => {
                                setComponents((prev) => prev.filter((_, i) => i !== index));
                            }}
                            buttons={component.components}
                        />
                    );
                } else if (component.type === ComponentType.Separator) {
                    const sepTop = component as {
                        type: ComponentType.Separator;
                        divider: boolean;
                        spacing: SeparatorSpacingSize;
                    };
                    return (
                        <DiscordSeparator
                            key={getKey(component)}
                            onMoveUp={() => setComponents((prev) => moveTopLevelUp(prev, index))}
                            onMoveDown={() => setComponents((prev) => moveTopLevelDown(prev, index))}
                            onDelete={() => {
                                setComponents((prev) => prev.filter((_, i) => i !== index));
                            }}
                            spacing={sepTop.spacing}
                            divider={sepTop.divider}
                            onChangeSpacing={(size) =>
                                setComponents((prev) => {
                                    const next = [...prev];
                                    const current = next[index] as {
                                        type: ComponentType.Separator;
                                        divider: boolean;
                                        spacing: SeparatorSpacingSize;
                                    };
                                    next[index] = {
                                        ...current,
                                        spacing: size,
                                    } as APIMessageTopLevelComponent;
                                    return next;
                                })
                            }
                            onChangeDivider={(value) =>
                                setComponents((prev) => {
                                    const next = [...prev];
                                    const current = next[index] as {
                                        type: ComponentType.Separator;
                                        divider: boolean;
                                        spacing: SeparatorSpacingSize;
                                    };
                                    next[index] = {
                                        ...current,
                                        divider: value,
                                    } as APIMessageTopLevelComponent;
                                    return next;
                                })
                            }
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}
