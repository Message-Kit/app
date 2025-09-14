"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import type { APIEmoji } from "discord-api-types/v10";
import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import { CheckIcon, GlobeIcon, ShieldIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Twemoji from "react-twemoji";
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
    emoji: APIEmoji | string | null;
    onEmojiSelect: (emoji: APIEmoji | string | null) => void;
}) {
    const [emojis, setEmojis] = useState<APIEmoji[] | null>(null);
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
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="p-2">
                    {emoji &&
                        (typeof emoji === "string" ? (
                            <Twemoji>{emoji}</Twemoji>
                        ) : (
                            emoji.id && (
                                <Image
                                    src={
                                        RouteBases.cdn +
                                        CDNRoutes.emoji(emoji.id, emoji.animated ? ImageFormat.GIF : ImageFormat.WebP)
                                    }
                                    alt="💔"
                                    width={32}
                                    height={32}
                                />
                            )
                        ))}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-3">
                <Tabs>
                    <TabsList className="w-full mb-2">
                        <TabsTrigger value="guild">
                            <ShieldIcon />
                            Guild
                        </TabsTrigger>
                        <TabsTrigger value="default">
                            <GlobeIcon />
                            Default
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="default" className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Input
                                placeholder="Enter emoji (e.g. 😩)"
                                className="w-full"
                                onChange={(e) => onEmojiSelect(e.target.value)}
                            />
                            {/* <p className="text-xs text-muted-foreground">Default emojis are converted to Twemoji</p> */}
                        </div>
                        <div className="flex gap-2 w-full">
                            <PopoverClose asChild>
                                <Button variant="destructive" className="flex-1">
                                    <TrashIcon />
                                    Remove
                                </Button>
                            </PopoverClose>
                            <PopoverClose asChild>
                                <Button className="flex-1">
                                    <CheckIcon />
                                    Confirm
                                </Button>
                            </PopoverClose>
                        </div>
                    </TabsContent>
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
                                                <PopoverClose asChild key={emoji.id}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (!emoji.id || !emoji.name) return;

                                                            onEmojiSelect({
                                                                animated: emoji.animated,
                                                                id: emoji.id,
                                                                name: emoji.name,
                                                            });
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
                                                </PopoverClose>
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
