import { SiDiscord } from "@icons-pack/react-simple-icons";
import { MessageFlags } from "discord-api-types/v10";
import {
    BotIcon,
    CheckIcon,
    CircleIcon,
    CopyIcon,
    EditIcon,
    ExternalLinkIcon,
    LogOutIcon,
    PlusIcon,
    SendIcon,
    WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFiles } from "@/lib/stores/files";
import { useGuildStore } from "@/lib/stores/guild";
import { useOutputStore } from "@/lib/stores/output";
import { useUserStore } from "@/lib/stores/user-store";
import { cn, type SendOptions } from "@/lib/utils";
import ChannelSelector from "../channel-selector";
import Preview from "../preview";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

export default function PreviewPanel() {
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
        <div className="max-h-screen flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b border-dashed overflow-x-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <a href="https://discord.gg/5bBM2TVDD3" target="_blank" rel="noopener noreferrer">
                            <PlusIcon />
                            Add App
                        </a>
                    </Button>
                    <Button variant="link" asChild>
                        <a href="https://discord.gg/5bBM2TVDD3" target="_blank" rel="noopener noreferrer">
                            Get Support
                            <ExternalLinkIcon />
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
            <div className="p-4 whitespace-pre-wrap flex-1 overflow-y-auto">
                <div className="flex flex-col bg-card rounded-xl border overflow-hidden">
                    <div className="p-2 border-b flex items-center justify-between">
                        <div className="ml-1.5 flex items-center gap-2">
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
    const [selectedChannel, setSelectedChannel] = useState("");
    const [selectedTab, setSelectedTab] = useState<"webhook" | "bot" | "server">("webhook");
    const { guild } = useGuildStore();

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
        if (selectedChannel.trim().length === 0) return false;
        return true;
    }, [selectedChannel]);

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
                <Button disabled={output.length === 0}>
                    <SendIcon />
                    Send Message
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>
                        {selectedTab === "webhook"
                            ? "Send a message via webhook."
                            : selectedTab === "bot"
                              ? "Send a message via the Message Kit app."
                              : "Edit an existing message."}
                    </DialogDescription>
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
                        <TabsTrigger value="bot" disabled={user === null || user === undefined || guild === null}>
                            <BotIcon />
                            Bot
                        </TabsTrigger>
                        <TabsTrigger value="edit" disabled>
                            <EditIcon />
                            Edit
                        </TabsTrigger>
                    </TabsList>
                    <div className={cn("flex flex-col gap-2", selectedTab === "webhook" ? "flex" : "hidden")}>
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
                    <div className={cn("flex flex-col gap-2", selectedTab === "bot" ? "flex" : "hidden")}>
                        <Label>
                            Channel<span className="text-destructive">*</span>
                        </Label>
                        <ChannelSelector onChannelChange={setSelectedChannel} />
                        <p className="text-xs text-muted-foreground">
                            Make sure Message Kit can send messages in the selected channel.
                        </p>
                    </div>
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
