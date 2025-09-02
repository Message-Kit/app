"use client";

import type { APIEmoji, APIMessageComponentEmoji } from "discord-api-types/v10";
import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";
import { SmileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function EmojiPicker({
    guildId,
    emoji,
    onEmojiSelect,
}: {
    guildId: string;
    emoji: APIMessageComponentEmoji | null;
    onEmojiSelect: (emoji: APIEmoji) => void;
}) {
    const [emojis, setEmojis] = useState<APIEmoji[]>([]);
    const [showPopover, setShowPopover] = useState(false);

    useEffect(() => {
        console.log(guildId);
        fetch(`/api/discord/guilds/${guildId}/emojis`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setEmojis(data);
            });
    }, [guildId]);

    return (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    {emoji?.id ? (
                        <Image
                            className="size-[20px]"
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
            <PopoverContent className="w-fit max-h-56 overflow-y-auto grid grid-cols-6">
                {emojis.map((emoji) => {
                    if (!emoji.id) return null;
                    if (!emoji.name) return null;

                    const url =
                        RouteBases.cdn + CDNRoutes.emoji(emoji.id, emoji.animated ? ImageFormat.GIF : ImageFormat.WebP);

                    return (
                        <Button
                            key={emoji.id}
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                onEmojiSelect(emoji);
                                setShowPopover(false);
                            }}
                        >
                            <Image className="size-[20px]" src={url} alt={emoji.name} width={32} height={32} />
                        </Button>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}
