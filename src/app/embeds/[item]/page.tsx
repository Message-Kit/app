"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle,
} from "@/components/ui/resizable";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Ellipsis, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Page() {
    const params = useParams();
    const item = params.item;

    useEffect(() => {
        console.log(item);
    }, [item]);

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60}>
                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome</CardTitle>
                            <CardDescription>
                                the main embed for #welcome
                            </CardDescription>
                            <CardAction>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={"ghost"} size={"icon"}>
                                            <Ellipsis />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <Copy />
                                            Copy Command
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash className="text-destructive" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter your title"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Enter your description"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <div className="p-4">
                    <div className="rounded-lg p-4 border flex flex-col gap-4">
                        hi world
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
