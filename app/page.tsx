"use client";

import Editor from "@/components/editor";
import Navbar from "@/components/navbar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useOutputStore } from "@/lib/stores/output";

export default function Page() {
    const { output } = useOutputStore();
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={55}>
                    <Editor />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={100 - 55}>
                    <pre className="p-4 whitespace-pre-wrap h-full overflow-y-auto">
                        {JSON.stringify(output, null, 2)}
                    </pre>
                    {/* <div className="p-4 h-full overflow-y-auto">
                        <div className="p-2 bg-[#2b2d31] rounded-xl border border-accent">
                            <Preview />
                        </div>
                    </div> */}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
