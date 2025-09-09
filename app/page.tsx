"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { CheckIcon, CircleIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useOutputStore } from "@/lib/stores/output";
import { fetchDiscordGuilds, sendMessageToChannel, sendMessageToWebhook } from "./actions";

export default function Page() {
    const { output } = useOutputStore();

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied]);

    return (
        <div className="h-screen flex flex-col">
            <Navbar
                sendMessageToChannel={sendMessageToChannel}
                sendMessageToWebhook={sendMessageToWebhook}
                fetchDiscordGuilds={fetchDiscordGuilds}
            />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={55}>
                    <Editor />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={100 - 55}>
                    <div className="p-4 whitespace-pre-wrap h-full overflow-y-auto">
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

                            {output.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground h-20 flex justify-center items-center">
                                    Add a component to view output.
                                </div>
                            ) : (
                                <Preview />
                            )}
                        </div>
                    </div>
                    {/* <div className="p-4 whitespace-pre-wrap h-full overflow-y-auto">
                        <div className="flex flex-col bg-card rounded-xl border">
                            <div className="p-2 border-b flex items-center justify-between">
                                <span className="ml-1.5 flex items-center gap-1.5">
                                    <CircleIcon className="size-4" fill="#fe5f58" strokeWidth={0} />
                                    <CircleIcon className="size-4" fill="#ffbc2e" strokeWidth={0} />
                                    <CircleIcon className="size-4" fill="#29c940" strokeWidth={0} />
                                </span>
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

                            {output.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground h-20 flex justify-center items-center">
                                    Add a component to view output.
                                </div>
                            ) : (
                                <pre className="p-4 whitespace-pre-wrap">{JSON.stringify(output, null, 4)}</pre>
                            )}
                        </div>
                    </div> */}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
