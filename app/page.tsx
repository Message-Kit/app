"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { CheckIcon, CircleIcon, CopyIcon, EyeIcon, SlidersVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Editor from "@/components/editor";
import Navbar from "@/components/navbar";
import Preview from "@/components/preview";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOutputStore } from "@/lib/stores/output";
import { fetchDiscordGuilds } from "./actions";
import { cn } from "@/lib/utils";

export default function Page() {
    const [selectedTab, setSelectedTab] = useState("editor");

    return (
        <div className="h-screen flex flex-col">
            <Navbar fetchDiscordGuilds={fetchDiscordGuilds} />

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
                        <TabsList className="w-full h-12 bg-card">
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

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied]);

    return (
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
    );
}
