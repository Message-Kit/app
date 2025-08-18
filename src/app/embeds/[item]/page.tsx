"use client";

import { useEffect, useState, type FormEvent } from "react";
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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Circle,
    Code,
    Copy,
    Ellipsis,
    Home,
    ImageIcon,
    List,
    Save,
    Text,
    Trash,
    User,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmbedBuilder } from "@discordjs/builders";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user";
import { Switch } from "@/components/ui/switch";
import { useSessionStore } from "@/stores/session";

export default function Page() {
    const params = useParams();
    const item = params.item;

    useEffect(() => {
        console.log(item);
    }, [item]);

    const [embedColor, setEmbedColor] = useState("#000000");

    const handleSendToDiscord = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = Object.fromEntries(
            new FormData(e.currentTarget).entries()
        ) as Record<string, string>;

        const embed = new EmbedBuilder()
            .setTitle(data.title?.trim() || null)
            .setDescription(data.description?.trim() || null)
            .setURL(data.url?.trim() || null);

        if (embedColor) {
            const hex = embedColor.replace(/^#/, "");
            if (/^[0-9a-f]{6}$/i.test(hex)) {
                embed.setColor(parseInt(hex, 16));
            }
        }

        if (data.footer?.trim() || data["footer-icon"]?.trim()) {
            embed.setFooter({
                text: data.footer?.trim() || "",
                iconURL: data["footer-icon"]?.trim() || undefined,
            });
        }

        const req = await fetch("/api/discord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                channelId: "2",
                body: { content: "hi world!", embeds: [embed.toJSON()] },
            }),
        });

        const res = await req.json();

        if (res.success) {
            toast.success("Embed sent to Discord!");
        } else {
            toast.error("Something went wrong!", {
                description: res.error.rawError.message,
            });
        }
    };

    const handleSave = async () => {
        console.log("save");
    };

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60}>
                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>cool embed 1</CardTitle>
                            <CardDescription>
                                the main embed for #rules
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
                        <Separator />
                        <CardContent>
                            <Tabs
                                defaultValue="general"
                                // orientation="vertical"
                                // className="w-full flex flex-row items-start gap-4 h-full"
                                className="w-full"
                            >
                                <TabsList
                                    // className="shrink-0 grid grid-cols-1 h-auto w-[124px] gap-1"
                                    className="w-full mb-4"
                                >
                                    <TabsTrigger
                                        value="general"
                                        className="justify-center"
                                    >
                                        <Text />
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="author"
                                        className="justify-center"
                                    >
                                        <User />
                                        Author
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="images"
                                        className="justify-center"
                                    >
                                        <ImageIcon />
                                        Images
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="fields"
                                        className="justify-center"
                                    >
                                        <List />
                                        Fields
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="other"
                                        className="justify-center"
                                    >
                                        <Code />
                                        Other
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="general">
                                    <form
                                        id="embed-form"
                                        onSubmit={handleSendToDiscord}
                                        className="space-y-6"
                                    >
                                        <div className="flex gap-2.5 w-full">
                                            <div className="space-y-2.5 w-full">
                                                <Label htmlFor="title">
                                                    Title
                                                </Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    placeholder="Enter your title"
                                                />
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label htmlFor="color">
                                                    Color
                                                </Label>
                                                <div className="flex gap-2.5">
                                                    <Input
                                                        id="color"
                                                        name="color"
                                                        placeholder="Enter your color (hex)"
                                                        value={embedColor}
                                                        onChange={(e) =>
                                                            setEmbedColor(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
                                                                size={"icon"}
                                                                type="button"
                                                            >
                                                                <Circle
                                                                    fill={
                                                                        embedColor
                                                                    }
                                                                />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="size-fit">
                                                            <HexColorPicker
                                                                color={
                                                                    embedColor
                                                                }
                                                                onChange={(
                                                                    color
                                                                ) =>
                                                                    setEmbedColor(
                                                                        color
                                                                    )
                                                                }
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder="Enter your description"
                                                className="h-28"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="url">URL</Label>
                                            <Input
                                                id="url"
                                                name="url"
                                                placeholder="Enter your url"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="footer">
                                                Footer
                                            </Label>
                                            <Input
                                                id="footer"
                                                name="footer"
                                                placeholder="Enter your footer text"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="footer-icon">
                                                Footer Icon
                                            </Label>
                                            <Input
                                                id="footer-icon"
                                                name="footer-icon"
                                                placeholder="Enter your footer icon URL"
                                            />
                                        </div>
                                    </form>
                                </TabsContent>
                                <TabsContent value="author">
                                    Author Content
                                </TabsContent>
                                <TabsContent value="images">
                                    Images Content
                                </TabsContent>
                                <TabsContent value="fields">
                                    Fields Content
                                </TabsContent>
                                <TabsContent value="code">
                                    Code Content
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <Separator />
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant={"outline"}>
                                <Copy />
                                Copy
                            </Button>
                            <Button
                                // variant={"outline"}
                                onClick={handleSave}
                            >
                                <Save />
                                Save
                            </Button>
                            {/* <Button
                                variant={"outline"}
                                type="submit"
                                form="embed-form"
                            >
                                <Send />
                                Send to Discord
                            </Button> */}
                        </CardFooter>
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
