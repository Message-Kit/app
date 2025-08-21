"use client";

import { useEffect, useState } from "react";
import Embed from "@/components/template-cards/embed";
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
    Box,
    Hash,
    MousePointerClick,
    Plus,
    Rows,
    Send,
    SquareChevronDown,
    SquareDashedTopSolid,
    Trash,
    Volume2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PlainMessage from "@/components/template-cards/plain-message";
import { toast } from "sonner";
import Buttons from "@/components/template-cards/action-rows/buttons";
import DropdownMenu from "@/components/template-cards/action-rows/dropdown-menu";

import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/v10";

export default function Page() {
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState("");
    const [items, setItems] = useState<string[]>([]);
    const [isActionRowDialogOpen, setIsActionRowDialogOpen] = useState(false);
    const [selectedActionRowType, setSelectedActionRowType] = useState("");

    const handleCreateItem = () => {
        if (selectedType === "embed") {
            setItems((prev) => [...prev, "embed"]);
        } else if (selectedType === "action-row") {
            setIsActionRowDialogOpen(true);
        } else if (selectedType === "container") {
            setItems((prev) => [...prev, "container"]);
        }

        setSelectedType("");
    };

    const handleCreateActionRow = () => {
        if (selectedActionRowType === "buttons") {
            setItems((prev) => [...prev, "action-row:buttons"]);
        } else if (selectedActionRowType === "dropdown-menu") {
            setItems((prev) => [...prev, "action-row:dropdown-menu"]);
        }
        setSelectedActionRowType("");
        setIsActionRowDialogOpen(false);
    };

    const handleSendTemplate = async () => {
        const embed = new EmbedBuilder()
            .setTitle("hi world")
            .setURL("https://ronykax.xyz")
            .setDescription("some description goes here");

        const button = new ButtonBuilder()
            .setLabel("Click me")
            .setStyle(ButtonStyle.Link)
            .setURL("https://ronykax.xyz");

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            button
        );

        const res = await fetch("/api/send-template", {
            method: "POST",
            body: JSON.stringify({
                channelId: selectedChannel,
                body: {
                    content: "some content goes here",
                    embeds: [embed],
                    components: [actionRow],
                },
            }),
        });

        if (res.ok) {
            toast.success("Template sent!");
        } else {
            toast.error("Error sending template!");
        }
    };

    interface Channel {
        id: string;
        name: string;
        type: number;
    }

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

    useEffect(() => console.log(channels), [channels]);

    return (
        <div className="py-16 px-4">
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-2xl md:text-4xl font-display font-bold">
                        untitled template 2
                    </span>
                    <span className="text-sm md:text-base text-muted-foreground">
                        Templates allow you to create messages that can be used
                        in your server.
                    </span>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus />
                            New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Item</DialogTitle>
                            <DialogDescription>
                                Create a new item to add to your template.
                            </DialogDescription>
                        </DialogHeader>
                        <Select
                            value={selectedType}
                            onValueChange={setSelectedType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="embed">
                                    <SquareDashedTopSolid />
                                    Embed
                                </SelectItem>
                                <SelectItem value="container">
                                    <Box />
                                    Container
                                </SelectItem>
                                <SelectItem value="action-row">
                                    <Rows />
                                    Action Row
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild onClick={handleCreateItem}>
                                <Button>
                                    {selectedType === "action-row"
                                        ? "Continue"
                                        : "Create"}
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isActionRowDialogOpen}
                    onOpenChange={setIsActionRowDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Action Row Type</DialogTitle>
                            <DialogDescription>
                                Choose the kind of action row to add.
                            </DialogDescription>
                        </DialogHeader>
                        <Select
                            value={selectedActionRowType}
                            onValueChange={setSelectedActionRowType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a kind" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="buttons">
                                    <MousePointerClick />
                                    Buttons
                                </SelectItem>
                                <SelectItem value="dropdown-menu">
                                    <SquareChevronDown />
                                    Dropdown Menu
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleCreateActionRow}>
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* This is the list of items */}
            <div className="flex flex-col gap-8 mt-4 md:mt-12 w-full">
                <PlainMessage />
                {items.map((type, index) =>
                    type === "embed" ? (
                        <Embed key={index} />
                    ) : type.startsWith("action-row") ? (
                        type === "action-row:buttons" ? (
                            <Buttons key={index} />
                        ) : type === "action-row:dropdown-menu" ? (
                            <DropdownMenu key={index} />
                        ) : null
                    ) : type === "container" ? null : null
                )}
            </div>

            <div className="mt-12 flex justify-end gap-2">
                <Button variant={"outline"}>
                    <Trash />
                    Delete
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Send />
                            Send
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select a channel</DialogTitle>
                            <DialogDescription>
                                Select a channel to send the template to.
                            </DialogDescription>
                        </DialogHeader>
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
                                            <SelectItem
                                                key={channel.id}
                                                value={channel.id}
                                            >
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
                                            <SelectItem
                                                key={channel.id}
                                                value={channel.id}
                                            >
                                                <Volume2 />
                                                {channel.name}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <DialogFooter>
                            {/* <DialogClose asChild>
                                <Button variant={"outline"}>Cancel</Button>
                            </DialogClose> */}
                            <DialogClose asChild>
                                <Button
                                    onClick={handleSendTemplate}
                                    disabled={!selectedChannel}
                                >
                                    Confirm
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
