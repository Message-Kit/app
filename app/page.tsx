"use client";

import { EyeIcon, SlidersVerticalIcon } from "lucide-react";
import { useState } from "react";
import EditorPanel from "@/components/panels/editor";
import PreviewPanel from "@/components/panels/preview";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function Page() {
    const [selectedTab, setSelectedTab] = useState<"editor" | "preview">("editor");

    const editor = <EditorPanel />;
    const preview = <PreviewPanel />;

    const left = 62.5;

    return (
        <div className="h-screen flex flex-col">
            {/* Desktop */}
            <div className="hidden md:flex flex-1">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={left}>{editor}</ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={100 - left}>{preview}</ResizablePanel>
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
                <div className={cn("size-full overflow-auto", selectedTab !== "editor" && "hidden")}>{editor}</div>
                <div className={cn("size-full overflow-auto", selectedTab !== "preview" && "hidden")}>{preview}</div>
            </div>
        </div>
    );
}
