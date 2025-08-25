import { Hash, Volume2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Channel } from "@/types/channel";
import { useEffect, useState } from "react";

interface Props {
    setSelectedChannel: (channel: string) => void;
}

export default function ChannelSelector({ setSelectedChannel }: Props) {
    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
        const fetchChannels = async () => {
            const res = await fetch("/api/get-channel-list", {
                method: "POST",
                body: JSON.stringify({
                    guildId: "1138777402684739587",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setChannels(
                    data.channels.filter(
                        (c: Channel) => c.type === 0 || c.type === 2
                    )
                );
            }
        };

        fetchChannels();
    }, []);

    return (
        <Select onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Text</SelectLabel>
                    {channels
                        .filter((c) => c.type === 0)
                        .map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                                <Hash />
                                {channel.name}
                            </SelectItem>
                        ))}
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Voice</SelectLabel>
                    {channels
                        .filter((c) => c.type === 2)
                        .map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                                <Volume2 />
                                {channel.name}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
