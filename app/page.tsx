"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { MessageFlags, type RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import {
    BotIcon,
    CheckIcon,
    CircleIcon,
    CopyIcon,
    ExternalLinkIcon,
    EyeIcon,
    LogOutIcon,
    SendIcon,
    SlidersVerticalIcon,
    WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChannelSelector from "@/components/channel-selector";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
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
import { Label } from "@/components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useFiles } from "@/lib/stores/files";
import { useOutputStore } from "@/lib/stores/output";
import { useUserStore } from "@/lib/stores/user-store";
import { cn, type SendOptions } from "@/lib/utils";
import { fetchDiscordGuilds } from "./actions";

export default function Page() {
    const [selectedTab, setSelectedTab] = useState("editor");

    return (
        <div className="h-screen flex flex-col">
            {/* Desktop */}
            <div className="hidden md:flex flex-1">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={55}>
                        <Editor />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={45}>
                        <PreviewWrapper />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Mobile */}
            <div className="flex flex-col md:hidden flex-1">
                <Tabs
                    defaultValue="editor"
                    className="w-full gap-0"
                    onValueChange={(value) => setSelectedTab(value as "editor" | "preview")}
                >
                    <div className="p-2 border-b m-0 bg-card">
                        <TabsList className="w-full bg-card">
                            <TabsTrigger value="editor">
                                <SlidersVerticalIcon />
                                Editor
                            </TabsTrigger>
                            <TabsTrigger value="preview">
                                <EyeIcon />
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>
                <div className={cn("size-full overflow-auto hidden", selectedTab === "editor" && "block")}>
                    <Editor />
                </div>
                <div className={cn("size-full overflow-auto hidden", selectedTab === "preview" && "block")}>
                    <PreviewWrapper />
                </div>
            </div>
        </div>
    );
}

function PreviewWrapper() {
    const { output } = useOutputStore();
    const { user } = useUserStore();

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied]);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 flex items-center justify-between border-b overflow-x-auto">
                <div className="flex items-center gap-2">
                    <Button variant="link" asChild>
                        <a href="https://discord.gg/5bBM2TVDD3" target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon />
                            Get Support
                        </a>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    {user === undefined ? (
                        <Skeleton />
                    ) : user === null ? (
                        <Button variant="ghost" asChild>
                            <Link href="/auth/login">
                                <SiDiscord />
                                Sign In
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="ghost" className="text-destructive" asChild>
                            <Link href="/auth/logout">
                                <LogOutIcon />
                                Logout
                            </Link>
                        </Button>
                    )}

                    <SendMessageButton />
                </div>
            </div>
            <div className="p-4 whitespace-pre-wrap overflow-y-auto">
                <div className="flex flex-col bg-card rounded-xl border overflow-hidden">
                    <div className="p-2 border-b flex items-center justify-between">
                        <div className="ml-1.5 flex items-center gap-1.5">
                            <CircleIcon className="size-4" fill="#fe5f58" strokeWidth={0} />
                            <CircleIcon className="size-4" fill="#ffbc2e" strokeWidth={0} />
                            <CircleIcon className="size-4" fill="#29c940" strokeWidth={0} />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <SiDiscord className="size-4" />
                            Discord
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(output, null, 4));
                                    setCopied(true);
                                }}
                                disabled={output.length === 0}
                            >
                                {copied ? <CheckIcon /> : <CopyIcon />}
                            </Button>
                        </div>
                    </div>
                    <Preview />
                </div>
            </div>
        </div>
    );
}

function SendMessageButton() {
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
    }, [selectedTab]);

    const { files } = useFiles();

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

        formData.append(
            "options",
            JSON.stringify({
                via: selectedTab === "webhook" ? "webhook" : "bot",
                channel_id: selectedTab === "bot" ? selectedChannel : undefined,
                webhook_url: selectedTab === "webhook" ? webhookUrl : undefined,
            } as SendOptions),
        );

        await fetch("/api/discord/send", {
            method: "POST",
            body: formData,
        });
    }

    return (
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
                                <Select onValueChange={(value) => setSelectedGuild(value)} value={selectedGuild}>
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
    );
}
