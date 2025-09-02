import type { APIButtonComponent, APIEmoji, APIMessageComponentEmoji } from "discord-api-types/v10";
import { ButtonStyle, ComponentType } from "discord-api-types/v10";
import { ChevronDown, ChevronDownIcon, ChevronUpIcon, ImageIcon, MousePointerClickIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EmojiPicker from "../emoji-picker";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

export default function NewTextDisplay({
    value,
    onChange,
    onMoveUp,
    onMoveDown,
    onDelete,
    guildId,
    accessory,
    onChangeAccessory,
}: {
    value: string;
    onChange: (next: string) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    guildId: string;
    accessory:
        | APIButtonComponent
        | { type: ComponentType.Thumbnail; media: { url: string }; description?: string }
        | null;
    onChangeAccessory: (
        next:
            | APIButtonComponent
            | { type: ComponentType.Thumbnail; media: { url: string }; description?: string }
            | null,
        currentValue: string,
    ) => void;
}) {
    const [accessoryTab, setAccessoryTab] = useState<"acc-image" | "acc-button" | null>(null);

    // button accessory
    const [buttonStyle, setButtonStyle] = useState<"primary" | "secondary" | "success" | "danger" | "link">("primary");
    const [buttonLabel, setButtonLabel] = useState("");
    const [buttonEmoji, setButtonEmoji] = useState<APIMessageComponentEmoji | null>(null);
    const [buttonActionId, setButtonActionId] = useState("");
    const [buttonUrl, setButtonUrl] = useState("");

    // image accessory
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    // initialize fields from incoming accessory
    useEffect(() => {
        if (!accessory) {
            setAccessoryTab(null);
            setButtonLabel("");
            setButtonEmoji(null);
            setButtonActionId("");
            setButtonUrl("");
            setImageUrl("");
            setImageAlt("");
            setButtonStyle("primary");
            return;
        }
        if (accessory.type === ComponentType.Button) {
            setAccessoryTab("acc-button");
            setButtonLabel("label" in accessory ? (accessory.label ?? "") : "");
            setButtonEmoji("emoji" in accessory ? (accessory.emoji ?? null) : null);
            if (accessory.style === ButtonStyle.Link) {
                setButtonStyle("link");
                setButtonUrl("url" in accessory ? (accessory.url ?? "") : "");
                setButtonActionId("");
            } else {
                // map to our local style options
                if (accessory.style === ButtonStyle.Primary) setButtonStyle("primary");
                else if (accessory.style === ButtonStyle.Secondary) setButtonStyle("secondary");
                else if (accessory.style === ButtonStyle.Success) setButtonStyle("success");
                else if (accessory.style === ButtonStyle.Danger) setButtonStyle("danger");
                else setButtonStyle("primary");
                setButtonActionId("custom_id" in accessory ? (accessory.custom_id ?? "") : "");
                setButtonUrl("");
            }
        } else if (accessory.type === ComponentType.Thumbnail) {
            setAccessoryTab("acc-image");
            setImageUrl(accessory.media?.url ?? "");
            setImageAlt(accessory.description ?? "");
        }
    }, [accessory]);

    const handleSaveAccessory = () => {
        if (!accessoryTab) return;
        if (accessoryTab === "acc-button") {
            const style =
                buttonStyle === "link"
                    ? ButtonStyle.Link
                    : buttonStyle === "secondary"
                      ? ButtonStyle.Secondary
                      : buttonStyle === "success"
                        ? ButtonStyle.Success
                        : buttonStyle === "danger"
                          ? ButtonStyle.Danger
                          : ButtonStyle.Primary;
            const nextButton: APIButtonComponent = {
                type: ComponentType.Button,
                style,
                label: buttonLabel || undefined,
                emoji: buttonEmoji || undefined,
                ...(style === ButtonStyle.Link ? { url: buttonUrl } : { custom_id: buttonActionId }),
            } as APIButtonComponent;
            onChangeAccessory(nextButton, value);
        } else if (accessoryTab === "acc-image") {
            const nextThumb: { type: ComponentType.Thumbnail; media: { url: string }; description?: string } = {
                type: ComponentType.Thumbnail,
                media: { url: imageUrl },
                description: imageAlt || undefined,
            };
            onChangeAccessory(nextThumb, value);
        }
    };

    return (
        <div className="flex flex-col border rounded-xl bg-card">
            <div className="px-2 py-2 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronDown />
                    </Button>
                    <div className="flex gap-4 items-center">
                        <span className="font-semibold text-sm text-accent-foreground">Plain Message</span>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <Dialog>
                        <DialogTrigger
                            asChild
                            onClick={() =>
                                setAccessoryTab(
                                    accessoryTab ??
                                        (accessory
                                            ? accessory.type === ComponentType.Button
                                                ? "acc-button"
                                                : "acc-image"
                                            : "acc-image"),
                                )
                            }
                        >
                            <button
                                type="button"
                                className="font-body font-semibold underline underline-offset-2 px-2 text-muted-foreground hover:text-primary-foreground text-xs"
                            >
                                {accessory ? "Edit" : "Set"} Accessory
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{accessory ? "Edit" : "Set"} Accessory</DialogTitle>
                                <DialogDescription>Set an accessory for your text display.</DialogDescription>
                            </DialogHeader>
                            {accessoryTab && (
                                <div className="flex flex-col gap-6">
                                    <Tabs
                                        defaultValue={accessoryTab}
                                        onValueChange={(v) => setAccessoryTab(v as "acc-image" | "acc-button")}
                                    >
                                        <TabsList className="w-full mb-4">
                                            <TabsTrigger value="acc-image">
                                                <ImageIcon />
                                                Image
                                            </TabsTrigger>
                                            <TabsTrigger value="acc-button">
                                                <MousePointerClickIcon />
                                                Button
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="acc-image" className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="image-url">Image</Label>
                                                <Input
                                                    id="image-url"
                                                    placeholder="Enter your image URL"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="image-alt">Description</Label>
                                                <Input
                                                    id="image-alt"
                                                    placeholder="Enter your image alt"
                                                    value={imageAlt}
                                                    onChange={(e) => setImageAlt(e.target.value)}
                                                />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="acc-button" className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="btn-label">Label</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="btn-label"
                                                        placeholder="Enter your label"
                                                        value={buttonLabel}
                                                        onChange={(e) => setButtonLabel(e.target.value)}
                                                    />
                                                    <EmojiPicker
                                                        guildId={guildId}
                                                        emoji={buttonEmoji}
                                                        onEmojiSelect={(e: APIEmoji) =>
                                                            setButtonEmoji({
                                                                id: e.id ?? undefined,
                                                                name: e.name ?? undefined,
                                                                animated: e.animated,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <RadioGroup
                                                value={buttonStyle}
                                                onValueChange={(v) => setButtonStyle(v as typeof buttonStyle)}
                                                defaultValue="primary"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="primary" id="r1" />
                                                    <Label htmlFor="r1">Primary</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="secondary" id="r2" />
                                                    <Label htmlFor="r2">Secondary</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="success" id="r3" />
                                                    <Label htmlFor="r3">Success</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="danger" id="r4" />
                                                    <Label htmlFor="r4">Danger</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="link" id="r5" />
                                                    <Label htmlFor="r5">Link</Label>
                                                </div>
                                            </RadioGroup>

                                            {/* show url input if style is link, otherwise show action id input */}
                                            {buttonStyle === "link" ? (
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="btn-url">URL</Label>
                                                    <Input
                                                        id="btn-url"
                                                        placeholder="Enter your URL"
                                                        value={buttonUrl}
                                                        onChange={(e) => setButtonUrl(e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="btn-action-id">Action ID</Label>
                                                    <Input
                                                        placeholder="Enter your action ID"
                                                        value={buttonActionId}
                                                        id="btn-action-id"
                                                        onChange={(e) => setButtonActionId(e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                            <DialogFooter>
                                {accessory && (
                                    <DialogClose asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                onChangeAccessory(null, value);
                                                setAccessoryTab(null);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </DialogClose>
                                )}
                                <DialogClose asChild>
                                    <Button onClick={handleSaveAccessory}>{accessory ? "Save" : "Add"}</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant={"ghost"} size={"icon"} className="size-7" onClick={onMoveUp}>
                        <ChevronUpIcon />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="size-7" onClick={onMoveDown}>
                        <ChevronDownIcon />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="size-7" onClick={onDelete}>
                        <TrashIcon />
                    </Button>
                </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2 p-4">
                <Label className="sr-only">Plain Message</Label>
                <Textarea placeholder="Enter your text here" value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        </div>
    );
}
