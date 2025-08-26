import { Folder, Hash, Image as ImageIcon, Megaphone, MessagesSquare, Mic2, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Channel } from "@/types/discord";
import { useEffect, useState } from "react";
import { useGuildStore } from "@/stores/guild";
import { ChannelType } from "discord-api-types/v10";

interface Props {
    setSelectedChannel: (channel: string) => void;
}

export default function ChannelSelector({ setSelectedChannel }: Props) {
    const [channels, setChannels] = useState<Channel[]>([]);
    const { guild } = useGuildStore();

    useEffect(() => {
        if (!guild) return;

        const fetchChannels = async () => {
            const res = await fetch("/api/get-channel-list", {
                method: "POST",
                body: JSON.stringify({
                    guildId: guild.id,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setChannels(
                    (data.channels as Channel[])
                        // ensure we have needed fields; drop threads and dm types if present
                        .filter((c) => typeof c.position === "number")
                );
            }
        };

        fetchChannels();
    }, [guild]);

    const renderIcon = (type: ChannelType) => {
        switch (type) {
            case ChannelType.GuildText:
                return <Hash />;
            case ChannelType.GuildVoice:
                return <Volume2 />;
            case ChannelType.GuildCategory:
                return <Folder />;
            case ChannelType.GuildAnnouncement:
                return <Megaphone />;
            case ChannelType.GuildStageVoice:
                return <Mic2 />;
            case ChannelType.GuildForum:
                return <MessagesSquare />;
            case ChannelType.GuildMedia:
                return <ImageIcon />;
            default:
                return <Hash />;
        }
    };

    // build ordered list with top-level channels first, then category groups
    const orderedElements = (() => {
        const categories = channels
            .filter((c) => c.type === ChannelType.GuildCategory)
            .sort((a, b) => a.position - b.position);

        const childrenByParent: Record<string, Channel[]> = {};
        for (const ch of channels) {
            if (ch.parent_id) {
                if (!childrenByParent[ch.parent_id]) childrenByParent[ch.parent_id] = [];
                childrenByParent[ch.parent_id].push(ch);
            }
        }
        for (const key of Object.keys(childrenByParent)) {
            childrenByParent[key].sort((a, b) => a.position - b.position);
        }

        const topLevel = channels
            .filter((c) => c.parent_id === null && c.type !== ChannelType.GuildCategory)
            .sort((a, b) => a.position - b.position);

        const elements: Array<{ kind: "channel"; value: Channel } | { kind: "category"; value: Channel; children: Channel[] }> = [];
        for (const ch of topLevel) {
            elements.push({ kind: "channel", value: ch });
        }
        for (const cat of categories) {
            elements.push({ kind: "category", value: cat, children: childrenByParent[cat.id] ?? [] });
        }
        return elements;
    })();

    return (
        <Select onValueChange={setSelectedChannel} disabled={!guild}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
                {orderedElements.map((el) => {
                    if (el.kind === "channel") {
                        const ch = el.value;
                        return (
                            <SelectItem key={ch.id} value={ch.id}>
                                {renderIcon(ch.type)}
                                {ch.name}
                            </SelectItem>
                        );
                    }
                    const cat = el.value;
                    const children = el.children;
                    if (!children.length) return null;
                    return (
                        <SelectGroup key={cat.id}>
                            <SelectLabel>{cat.name}</SelectLabel>
                            {children.map((channel) => (
                                <SelectItem key={channel.id} value={channel.id}>
                                    {renderIcon(channel.type)}
                                    {channel.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
