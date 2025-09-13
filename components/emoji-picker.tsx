"use client";

import type { APIEmoji, APIMessageComponentEmoji } from "discord-api-types/v10";
import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import { GlobeIcon, ShieldIcon, SmileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Spinner } from "./ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function EmojiPicker({
    guildId,
    emoji,
    onEmojiSelect,
}: {
    guildId: string;
    emoji: APIMessageComponentEmoji | null;
    onEmojiSelect: (emoji: APIEmoji) => void;
}) {
    const [emojis, setEmojis] = useState<APIEmoji[] | null>(null);
    const [showPopover, setShowPopover] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(`/api/discord/guilds/${guildId}/emojis`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setEmojis(data);
                } else {
                    setEmojis([]);
                }
            })
            .catch(() => setEmojis([]));
    }, [guildId]);

    return (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    {emoji?.id ? (
                        <Image
                            className="size-[18px]"
                            src={
                                RouteBases.cdn +
                                CDNRoutes.emoji(emoji.id, emoji.animated ? ImageFormat.GIF : ImageFormat.WebP)
                            }
                            alt={"selected emoji"}
                            width={32}
                            height={32}
                        />
                    ) : (
                        <SmileIcon className="text-muted-foreground" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-3">
                <Tabs>
                    <TabsList className="w-full">
                        <TabsTrigger value="guild">
                            <ShieldIcon />
                            Guild
                        </TabsTrigger>
                        <TabsTrigger value="default">
                            <GlobeIcon />
                            Default
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="default" className="flex flex-col gap-3"></TabsContent>
                    <TabsContent value="guild" className="flex flex-col gap-3">
                        <Input
                            placeholder="Search for an emoji"
                            className="w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {emojis === null ? (
                            <div className="flex justify-center">
                                <Spinner size="medium" />
                            </div>
                        ) : (
                            <div className="flex flex-wrap">
                                {emojis.length === 0 ? (
                                    <span className="text-sm text-muted-foreground p-4 text-center w-full">
                                        No emojis found
                                    </span>
                                ) : (
                                    emojis
                                        .filter((emoji) => emoji.name?.toLowerCase().includes(search.toLowerCase()))
                                        .map((emoji) => {
                                            if (!emoji.id) return null;
                                            if (!emoji.name) return null;

                                            const url =
                                                RouteBases.cdn +
                                                CDNRoutes.emoji(
                                                    emoji.id,
                                                    emoji.animated ? ImageFormat.GIF : ImageFormat.WebP,
                                                );

                                            return (
                                                <Button
                                                    key={emoji.id}
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        onEmojiSelect(emoji);
                                                        setShowPopover(false);
                                                    }}
                                                    title={emoji.name}
                                                    className="overflow-hidden"
                                                >
                                                    <Image
                                                        className="size-[18px]"
                                                        src={url}
                                                        alt={emoji.name}
                                                        width={32}
                                                        height={32}
                                                    />
                                                </Button>
                                            );
                                        })
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
