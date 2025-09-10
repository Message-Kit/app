"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { MessageFlags, type RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { BotIcon, CheckIcon, ExternalLinkIcon, SendIcon, WebhookIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useFilesStore from "@/lib/stores/files";
import { useOutputStore } from "@/lib/stores/output";
import { useUserStore } from "@/lib/stores/user-store";
import ChannelSelector from "./channel-selector";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

export default function Navbar({
    fetchDiscordGuilds,
}: {
    fetchDiscordGuilds: () => Promise<{
        data: RESTGetAPICurrentUserGuildsResult | null;
        error: string | null;
    }>;
}) {
    const { output } = useOutputStore();
    const { user } = useUserStore();
    const [webhookUrl, setWebhookUrl] = useState("");
    const [channelSelectorDisabled, setChannelSelectorDisabled] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState("");
    const [selectedGuild, setSelectedGuild] = useState("");
    const [selectedTab, setSelectedTab] = useState<"webhook" | "bot" | "server">("webhook");
    const [guilds, setGuilds] = useState<RESTGetAPICurrentUserGuildsResult>([]);
    const [guildsLoading, setGuildsLoading] = useState(false);

    const webhookIsValid = useMemo(() => {
        if (webhookUrl.trim().length === 0) return false;
        try {
            new URL(webhookUrl);
            return true;
        } catch {
            return false;
        }
    }, [webhookUrl]);

    const botIsValid = useMemo(() => {
        if (selectedGuild.trim().length === 0) return false;
        if (selectedChannel.trim().length === 0) return false;
        return true;
    }, [selectedChannel, selectedGuild]);

    useEffect(() => {
        if (selectedGuild.trim().length !== 0) {
            setChannelSelectorDisabled(false);
        }
    }, [selectedGuild]);

    useEffect(() => {
        if (selectedTab === "bot") {
            setGuildsLoading(true);
            fetchDiscordGuilds()
                .then((data) => {
                    setGuilds(data.data ?? []);
                    setGuildsLoading(false);
                })
                .catch(() => {
                    setGuildsLoading(false);
                })
                .finally(() => {
                    setGuildsLoading(false);
                });
        }
    }, [selectedTab, fetchDiscordGuilds]);

    const { files } = useFilesStore();

    async function handleSendMessage() {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("images", file);
        });

        formData.append(
            "message",
            JSON.stringify({
                components: output,
                flags: MessageFlags.IsComponentsV2,
            }),
        );

        await fetch("/api/discord/send", {
            method: "POST",
            body: formData,
        });
    }

    return (
        <div className="px-4 py-4 bg-card border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
                <a href="https://messagekit.app">
                    <div className="flex items-center gap-2.5">
                        <Image src="/logo.svg" className="size-7" alt="Logo" width={32} height={32} />
                        <span className="text-lg font-bold font-display md:block hidden">Message Kit</span>
                    </div>
                </a>
            </div>
            <div className="flex items-center gap-2">
                {user === undefined ? (
                    <Skeleton className="w-[120px] h-8 rounded-md" />
                ) : user === null ? (
                    <Button variant="ghost" asChild>
                        <Link href="/auth/login">
                            <SiDiscord />
                            Sign In
                        </Link>
                    </Button>
                ) : (
                    <Button variant="link" asChild>
                        <a href="https://discord.gg/5bBM2TVDD3" target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon />
                            Get Support
                        </a>
                    </Button>
                )}

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <SendIcon />
                            Send Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Message</DialogTitle>
                            <DialogDescription>Send this message to a channel</DialogDescription>
                        </DialogHeader>
                        <Tabs
                            onValueChange={(value) => setSelectedTab(value as "webhook" | "bot" | "server")}
                            defaultValue={selectedTab}
                        >
                            <TabsList className="mb-4 w-full">
                                <TabsTrigger value="webhook">
                                    <WebhookIcon />
                                    Webhook
                                </TabsTrigger>
                                <TabsTrigger value="bot" disabled={user === null || user === undefined}>
                                    <BotIcon />
                                    Bot
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="webhook">
                                <div className="flex flex-col gap-2">
                                    <Label>
                                        Webhook URL
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        placeholder="Enter webhook URL"
                                        value={webhookUrl}
                                        inputMode="url"
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                        className="wrap-anywhere"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Non-link buttons cannot be sent through webhooks.
                                    </p>
                                </div>
                            </TabsContent>
                            <TabsContent value="bot">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Guild<span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(value) => setSelectedGuild(value)}
                                            value={selectedGuild}
                                        >
                                            <SelectTrigger className="w-full" disabled={guildsLoading}>
                                                <SelectValue
                                                    placeholder={guildsLoading ? "Loading guilds..." : "Select a guild"}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {guilds.length === 0 && (
                                                    <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
                                                        <span>
                                                            Failed to fetch guilds, please login{" "}
                                                            <a
                                                                href="/auth/login?prompt=none"
                                                                className="underline underline-offset-2"
                                                            >
                                                                here
                                                            </a>
                                                            .
                                                        </span>
                                                    </div>
                                                )}
                                                {guilds.map((guild) => (
                                                    <SelectItem key={guild.id} value={guild.id}>
                                                        {guild.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            Invite the bot to your server by clicking{" "}
                                            <a
                                                href="https://discord.com/oauth2/authorize?client_id=1067725778512519248"
                                                className="underline underline-offset-2"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                here
                                            </a>
                                            .
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Channel<span className="text-destructive">*</span>
                                        </Label>
                                        <ChannelSelector
                                            setSelectedChannel={setSelectedChannel}
                                            guildId={selectedGuild}
                                            disabled={channelSelectorDisabled}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    disabled={selectedTab === "bot" ? !botIsValid : !webhookIsValid}
                                    onClick={handleSendMessage}
                                >
                                    <CheckIcon />
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
