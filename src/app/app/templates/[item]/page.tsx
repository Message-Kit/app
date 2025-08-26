"use client";

import PlainContent from "@/components/cards/plain-content";
import { Separator } from "@/components/ui/separator";
import MediaGallery from "@/components/cards/media-gallery";
import CoolSeparator from "@/components/cards/separator";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizableHandle } from "@/components/ui/resizable";
import MessagePreview from "@/components/message-preview";
import {
    ItemType,
    TypeContainer,
    type FinalMessage,
    AccessoryType,
    type TypePlainContent,
    type TypeMediaGallery,
    type TypeSeparator,
    Template,
} from "@/types";
import { Box, ChevronDown, ChevronUp, DiamondMinus, Ellipsis, ImagesIcon, Plus, Save, SaveIcon, Send, TextIcon, Trash } from "lucide-react";
import { useState, Fragment, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectionBuilder, ContainerBuilder, TextDisplayBuilder, ButtonBuilder, SeparatorBuilder, MediaGalleryBuilder } from "@discordjs/builders";
import { MessageFlags, SeparatorSpacingSize } from "discord-api-types/v10";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import ChannelSelector from "@/components/channel-selector";
import { nanoid } from "nanoid";
import { useNavbar } from "@/stores/navbar";

export default function Page() {
    const [data, setData] = useState<Template | null>(null);
    const [finalMessage, setFinalMessage] = useState<FinalMessage>([]);
    const [collapsedContainers, setCollapsedContainers] = useState<Record<number, boolean>>({});
    const [containerToDelete, setContainerToDelete] = useState<number | null>(null);

    function moveArrayItem<T>(arr: T[], from: number, to: number): T[] {
        const next = arr.slice();
        if (from < 0 || from >= next.length || to < 0 || to >= next.length) return arr;
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
    }

    function updateTopLevel(idx: number, updater: (item: FinalMessage[number]) => FinalMessage[number]) {
        setFinalMessage((prev) => {
            const next = [...prev];
            next[idx] = updater(next[idx]);

            return next;
        });
    }

    function updateContainerChild(
        containerIdx: number,
        childIdx: number,
        updater: (item: TypeContainer["items"][number]) => TypeContainer["items"][number]
    ) {
        setFinalMessage((prev) => {
            const next = [...prev];
            const container = next[containerIdx] as TypeContainer;
            const newItems = container.items.slice();

            newItems[childIdx] = updater(newItems[childIdx]);
            next[containerIdx] = { ...container, items: newItems };

            return next;
        });
    }

    function addComponentToFinalMessage(type: ItemType) {
        setFinalMessage((prev) => {
            const next = [...prev];

            if (type === ItemType.Container) {
                next.push({ type: ItemType.Container, color: "#398cf9", items: [] });
            } else if (type === ItemType.PlainContent) {
                next.push({ type: ItemType.PlainContent, content: "" });
            } else if (type === ItemType.MediaGallery) {
                next.push({ type: ItemType.MediaGallery, urls: [] });
            } else if (type === ItemType.Separator) {
                next.push({ type: ItemType.Separator, visible: false, size: "small" });
            }

            return next;
        });
    }

    function addComponentToContainer(containerIdx: number, type: ItemType) {
        setFinalMessage((prev) => {
            const next = [...prev];
            const existing = next[containerIdx];
            if (!existing || existing.type !== ItemType.Container) return prev;

            const container = existing as TypeContainer;
            const newItems = container.items.slice();

            if (type === ItemType.PlainContent) {
                newItems.push({ type: ItemType.PlainContent, content: "" });
            } else if (type === ItemType.MediaGallery) {
                newItems.push({ type: ItemType.MediaGallery, urls: [] });
            } else if (type === ItemType.Separator) {
                newItems.push({ type: ItemType.Separator, visible: false, size: "small" });
            } else {
                return prev;
            }

            next[containerIdx] = { ...container, items: newItems };
            return next;
        });
    }

    function moveTopLevelUp(idx: number) {
        setFinalMessage((prev) => moveArrayItem(prev, idx, Math.max(0, idx - 1)));
    }

    function moveTopLevelDown(idx: number) {
        setFinalMessage((prev) => moveArrayItem(prev, idx, Math.min(prev.length - 1, idx + 1)));
    }

    function deleteTopLevel(idx: number) {
        setFinalMessage((prev) => prev.filter((_, i) => i !== idx));
    }

    function moveContainerChildUp(containerIdx: number, childIdx: number) {
        setFinalMessage((prev) => {
            const next = [...prev];
            const container = next[containerIdx] as TypeContainer;
            const newItems = moveArrayItem(container.items, childIdx, Math.max(0, childIdx - 1));
            next[containerIdx] = { ...container, items: newItems };
            return next;
        });
    }

    function moveContainerChildDown(containerIdx: number, childIdx: number) {
        setFinalMessage((prev) => {
            const next = [...prev];
            const container = next[containerIdx] as TypeContainer;
            const newItems = moveArrayItem(container.items, childIdx, Math.min(container.items.length - 1, childIdx + 1));
            next[containerIdx] = { ...container, items: newItems };
            return next;
        });
    }

    function deleteContainerChild(containerIdx: number, childIdx: number) {
        setFinalMessage((prev) => {
            const next = [...prev];
            const container = next[containerIdx] as TypeContainer;
            const newItems = container.items.filter((_, i) => i !== childIdx);
            next[containerIdx] = { ...container, items: newItems };
            return next;
        });
    }

    async function sendTemplateToDiscord() {
        function buildPlainContent(item: TypePlainContent) {
            const accessory = item.accessory;
            if (accessory) {
                const section = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(item.content));

                if (accessory.type === AccessoryType.Button) {
                    const { label, style, customId } = accessory.value;
                    section.setButtonAccessory(new ButtonBuilder().setLabel(label).setStyle(style).setCustomId(nanoid(10)));
                    // section.setButtonAccessory(new ButtonBuilder().setLabel(label).setStyle(style).setCustomId(customId));
                } else if (accessory.type === AccessoryType.Image) {
                    const { url, alt } = accessory.value;
                    section.setThumbnailAccessory((thumbnail) => thumbnail.setURL(url).setDescription(alt));
                }

                return section;
            }

            return new TextDisplayBuilder().setContent(item.content);
        }

        function buildMediaGallery(item: TypeMediaGallery) {
            const gallery = new MediaGalleryBuilder();
            for (const url of item.urls) {
                gallery.addItems((i) => i.setURL(url));
            }
            return gallery;
        }

        function buildSeparator(item: TypeSeparator) {
            return new SeparatorBuilder()
                .setDivider(Boolean(item.visible))
                .setSpacing(item.size === "large" ? SeparatorSpacingSize.Large : SeparatorSpacingSize.Small);
        }

        const theFinalMessage = finalMessage.map((entry) => {
            if (entry.type === ItemType.Container) {
                const container = new ContainerBuilder();
                for (const child of entry.items) {
                    if (child.type === ItemType.PlainContent) {
                        const component = buildPlainContent(child);
                        if (component instanceof SectionBuilder) {
                            container.addSectionComponents(component);
                        } else {
                            container.addTextDisplayComponents(component);
                        }
                    } else if (child.type === ItemType.MediaGallery) {
                        container.addMediaGalleryComponents(buildMediaGallery(child));
                    } else if (child.type === ItemType.Separator) {
                        container.addSeparatorComponents(buildSeparator(child));
                    }
                }
                return container;
            }

            if (entry.type === ItemType.PlainContent) return buildPlainContent(entry);
            if (entry.type === ItemType.MediaGallery) return buildMediaGallery(entry);
            if (entry.type === ItemType.Separator) return buildSeparator(entry);
            return new SeparatorBuilder().setDivider(false).setSpacing(SeparatorSpacingSize.Small);
        });

        const res = await fetch("/api/send-template", {
            method: "POST",
            body: JSON.stringify({
                channelId: selectedChannel,
                body: {
                    components: theFinalMessage,
                    flags: MessageFlags.IsComponentsV2,
                },
            }),
        });

        console.log(await res.json());

        if (res.ok) {
            console.log("sent!");
        } else {
            console.error("error sending template!");
        }
    }

    const params = useParams();
    const templateId = params.item as string;

    useEffect(() => {
        const fetchTemplate = async () => {
            const { data, error } = await supabase.from("templates").select("*").eq("id", templateId).single();

            if (error) {
                console.error(error);
            } else {
                setData(data);
            }
        };

        fetchTemplate();
    }, [templateId]);

    useEffect(() => {
        if (data) {
            setFinalMessage(data.body);
        }
    }, [data]);

    async function saveTemplateToSupabase() {
        const { error } = await supabase.from("templates").update({ body: finalMessage }).eq("id", templateId);

        if (error) {
            console.error("failed to save template:", error);
        } else {
            toast.success("Template saved", { icon: <SaveIcon size={16} /> });
        }
    }

    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

    const { setHeading } = useNavbar();

    useEffect(() => {
        setHeading(data?.name ?? null);
    }, [setHeading, data]);

    if (!data) return <div className="h-96 py-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>;

    return (
        <ResizablePanelGroup direction="horizontal" className="border-b">
            <ResizablePanel defaultSize={61.5}>
                <div className="flex flex-col gap-4 w-full p-4">
                    <div className="flex gap-2 justify-between">
                        <div className="w-[264px]">
                            <ChannelSelector setSelectedChannel={setSelectedChannel} />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={saveTemplateToSupabase} variant={"outline"} size={"icon"}>
                                <SaveIcon />
                            </Button>
                            <Button onClick={sendTemplateToDiscord} variant={"outline"} size={"icon"}>
                                <Send />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>
                                        <Plus />
                                        Add Component
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => addComponentToFinalMessage(ItemType.PlainContent)}>
                                        <TextIcon />
                                        Plain Content
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => addComponentToFinalMessage(ItemType.MediaGallery)}>
                                        <ImagesIcon />
                                        Media Gallery
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => addComponentToFinalMessage(ItemType.Separator)}>
                                        <DiamondMinus />
                                        Separator
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => addComponentToFinalMessage(ItemType.Container)}>
                                        <Box />
                                        Container
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    {finalMessage.map((entry, index) => {
                        // Container
                        if (entry.type === ItemType.Container) {
                            const container = entry as TypeContainer;
                            const isCollapsed = collapsedContainers[index] ?? container.items.length === 0;
                            return (
                                <Fragment key={`container-${index}`}>
                                    <div
                                        className="rounded-xl border bg-card/50 border-l-4"
                                        style={{ borderLeftColor: container.color }}
                                        key={index}
                                    >
                                        <div className="flex gap-2 items-center justify-between p-4">
                                            <div className="flex gap-2 items-center">
                                                <Button
                                                    size={"icon"}
                                                    variant={"ghost"}
                                                    className="size-7"
                                                    aria-expanded={!isCollapsed}
                                                    onClick={() => setCollapsedContainers((prev) => ({ ...prev, [index]: !isCollapsed }))}
                                                >
                                                    {isCollapsed ? <ChevronDown /> : <ChevronUp />}
                                                </Button>
                                                <div className="flex gap-2">
                                                    <span className="font-bold">Container</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size={"icon"} variant={"ghost"}>
                                                            <Ellipsis />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                moveTopLevelUp(index);
                                                            }}
                                                        >
                                                            <ChevronUp />
                                                            Move Up
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                moveTopLevelDown(index);
                                                            }}
                                                        >
                                                            <ChevronDown />
                                                            Move Down
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setContainerToDelete(index);
                                                            }}
                                                        >
                                                            <Trash className="text-destructive" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"outline"}>
                                                            <Plus />
                                                            Add Component
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuItem
                                                                onClick={() => addComponentToContainer(index, ItemType.PlainContent)}
                                                            >
                                                                <TextIcon />
                                                                Plain Content
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => addComponentToContainer(index, ItemType.MediaGallery)}
                                                            >
                                                                <ImagesIcon />
                                                                Media Gallery
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => addComponentToContainer(index, ItemType.Separator)}>
                                                                <DiamondMinus />
                                                                Separator
                                                            </DropdownMenuItem>
                                                        </DropdownMenuGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* everything below is collapsible including the separator */}
                                        {container.items.length > 0 && !isCollapsed && <Separator />}
                                        <div
                                            className={`p-4 flex flex-col gap-4 ${
                                                container.items.length > 0 && !isCollapsed ? "block" : "hidden"
                                            }`}
                                        >
                                            {container.items.map((item, itemIndex) => (
                                                <div key={itemIndex}>
                                                    {item.type === ItemType.PlainContent ? (
                                                        <PlainContent
                                                            content={item.content}
                                                            accessory={item.accessory}
                                                            setContent={(value) =>
                                                                updateContainerChild(index, itemIndex, (old) =>
                                                                    old.type === ItemType.PlainContent ? { ...old, content: value } : old
                                                                )
                                                            }
                                                            setAccessory={(acc) =>
                                                                updateContainerChild(index, itemIndex, (old) =>
                                                                    old.type === ItemType.PlainContent ? { ...old, accessory: acc } : old
                                                                )
                                                            }
                                                            onMoveUp={() => moveContainerChildUp(index, itemIndex)}
                                                            onMoveDown={() => moveContainerChildDown(index, itemIndex)}
                                                            onDelete={() => deleteContainerChild(index, itemIndex)}
                                                        />
                                                    ) : item.type === ItemType.MediaGallery ? (
                                                        <MediaGallery
                                                            urls={item.urls}
                                                            setUrls={(urls) =>
                                                                updateContainerChild(index, itemIndex, (old) =>
                                                                    old.type === ItemType.MediaGallery ? { ...old, urls } : old
                                                                )
                                                            }
                                                            onMoveUp={() => moveContainerChildUp(index, itemIndex)}
                                                            onMoveDown={() => moveContainerChildDown(index, itemIndex)}
                                                            onDelete={() => deleteContainerChild(index, itemIndex)}
                                                        />
                                                    ) : (
                                                        <CoolSeparator
                                                            visible={item.visible}
                                                            size={item.size}
                                                            onChange={({ visible, size }) =>
                                                                updateContainerChild(index, itemIndex, (old) =>
                                                                    old.type === ItemType.Separator ? { ...old, visible, size } : old
                                                                )
                                                            }
                                                            onMoveUp={() => moveContainerChildUp(index, itemIndex)}
                                                            onMoveDown={() => moveContainerChildDown(index, itemIndex)}
                                                            onDelete={() => deleteContainerChild(index, itemIndex)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Dialog
                                        open={containerToDelete === index}
                                        onOpenChange={(open) => {
                                            if (!open) setContainerToDelete(null);
                                        }}
                                        key={`container-deletee-${index}`}
                                    >
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete component?</DialogTitle>
                                                <DialogDescription>This will remove this component.</DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => {
                                                            deleteTopLevel(index);
                                                            setContainerToDelete(null);
                                                        }}
                                                    >
                                                        Confirm
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </Fragment>
                            );
                        }

                        // Plain Content
                        return (
                            <div key={index}>
                                {entry.type === ItemType.PlainContent ? (
                                    <PlainContent
                                        content={entry.content}
                                        accessory={entry.accessory}
                                        setContent={(value) =>
                                            updateTopLevel(index, (old) =>
                                                old.type === ItemType.PlainContent
                                                    ? {
                                                          ...old,
                                                          content: value,
                                                      }
                                                    : old
                                            )
                                        }
                                        setAccessory={(acc) =>
                                            updateTopLevel(index, (old) =>
                                                old.type === ItemType.PlainContent
                                                    ? {
                                                          ...old,
                                                          accessory: acc,
                                                      }
                                                    : old
                                            )
                                        }
                                        onMoveUp={() => moveTopLevelUp(index)}
                                        onMoveDown={() => moveTopLevelDown(index)}
                                        onDelete={() => deleteTopLevel(index)}
                                    />
                                ) : entry.type === ItemType.MediaGallery ? (
                                    <MediaGallery
                                        urls={entry.urls}
                                        setUrls={(urls) =>
                                            updateTopLevel(index, (old) => (old.type === ItemType.MediaGallery ? { ...old, urls } : old))
                                        }
                                        onMoveUp={() => moveTopLevelUp(index)}
                                        onMoveDown={() => moveTopLevelDown(index)}
                                        onDelete={() => deleteTopLevel(index)}
                                    />
                                ) : (
                                    <CoolSeparator
                                        visible={entry.visible}
                                        size={entry.size}
                                        onChange={({ visible, size }) =>
                                            updateTopLevel(index, (old) =>
                                                old.type === ItemType.Separator
                                                    ? {
                                                          ...old,
                                                          visible,
                                                          size,
                                                      }
                                                    : old
                                            )
                                        }
                                        onMoveUp={() => moveTopLevelUp(index)}
                                        onMoveDown={() => moveTopLevelDown(index)}
                                        onDelete={() => deleteTopLevel(index)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={38.5}>
                {finalMessage.length === 0 ? (
                    <div className="p-6 text-muted-foreground text-center">Add a component to see preview.</div>
                ) : (
                    <div className="p-4">
                        <MessagePreview finalMessage={finalMessage} />
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
