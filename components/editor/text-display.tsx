import { type APISectionAccessoryComponent, ButtonStyle, ComponentType } from "discord-api-types/v10";
import { CheckIcon, ImageIcon, MousePointerClickIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import NewBuilder from "../new-builder";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

export default function TextDisplay({
    content,
    onContentChange,
    onMoveUp,
    onMoveDown,
    onRemove,
    accessory,
    setAccessory,
    removeAccessory,
}: {
    content: string;
    onContentChange: (content: string) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    accessory?: APISectionAccessoryComponent;
    setAccessory?: (accessory: APISectionAccessoryComponent) => void;
    removeAccessory?: () => void;
}) {
    const [tab, setTab] = useState<"thumbnail" | "button">("thumbnail");

    // image accesory
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    // button accesory
    const [buttonLabel, setButtonLabel] = useState("");
    const [buttonStyle, setButtonStyle] = useState<"primary" | "secondary" | "success" | "danger" | "link">("primary");
    const [buttonUrl, setButtonUrl] = useState("");
    const [buttonActionId, setButtonActionId] = useState("");

    const isValid = useMemo(() => {
        if (tab === "thumbnail") {
            if (!imageUrl.trim()) return false;
            try {
                new URL(imageUrl);
                return true;
            } catch {
                return false;
            }
        }

        if (tab === "button") {
            if (!buttonLabel.trim()) return false;
            if (buttonStyle === "link") {
                try {
                    new URL(buttonUrl);
                    return true;
                } catch {
                    return false;
                }
            } else {
                return buttonActionId.trim().length > 0;
            }
        }

        return false;
    }, [imageUrl, buttonLabel, buttonStyle, buttonUrl, buttonActionId, tab]);

    function buttonTypeToButtonStyle(type: string) {
        switch (type) {
            case "link":
                return ButtonStyle.Link;
            case "secondary":
                return ButtonStyle.Secondary;
            case "success":
                return ButtonStyle.Success;
            case "danger":
                return ButtonStyle.Danger;
            default:
                return ButtonStyle.Primary;
        }
    }

    return (
        <>
            <NewBuilder
                name="Text Display"
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onRemove={onRemove}
                extraButton={
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="h-7 text-xs font-semibold text-muted-foreground"
                                // onClick={() => {
                                //     if (accessory?.type) return;
                                //     setAccessory?.({
                                //         type: ComponentType.Thumbnail,
                                //         media: { url: imageUrl },
                                //         description: imageAlt,
                                //     });
                                // }}
                            >
                                <PlusIcon />
                                {accessory?.type ? "Edit" : "Add"} Accessory
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Set Accessory</DialogTitle>
                                <DialogDescription>Set the accessory for the text display.</DialogDescription>
                            </DialogHeader>
                            <Tabs
                                defaultValue={
                                    accessory && accessory.type === ComponentType.Thumbnail
                                        ? "thumbnail"
                                        : accessory && accessory.type === ComponentType.Button
                                          ? "button"
                                          : "balls"
                                }
                                // onValueChange={(value) => {
                                //     if (value === "thumbnail") {
                                //         setAccessory?.({
                                //             type: ComponentType.Thumbnail,
                                //             media: { url: imageUrl },
                                //             description: imageAlt,
                                //         });
                                //     } else if (value === "button") {
                                //         setAccessory?.({
                                //             type: ComponentType.Button,
                                //             label: buttonLabel,
                                //             style:
                                //                 buttonStyle === "link"
                                //                     ? ButtonStyle.Link
                                //                     : buttonStyle === "secondary"
                                //                       ? ButtonStyle.Secondary
                                //                       : buttonStyle === "success"
                                //                         ? ButtonStyle.Success
                                //                         : buttonStyle === "danger"
                                //                           ? ButtonStyle.Danger
                                //                           : ButtonStyle.Primary,
                                //             url: buttonUrl,
                                //             custom_id: buttonActionId,
                                //         });
                                //     }
                                // }}
                                onValueChange={(value) => setTab(value as "thumbnail" | "button")}
                            >
                                <TabsList className="mb-3 w-full">
                                    <TabsTrigger value="thumbnail">
                                        <ImageIcon />
                                        Thumbnail
                                    </TabsTrigger>
                                    <TabsTrigger value="button">
                                        <MousePointerClickIcon />
                                        Button
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="thumbnail" className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="image-url">Image</Label>
                                        <Input
                                            id="image-url"
                                            placeholder="https://example.com/image.png"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="image-alt">Description (Alt Text)</Label>
                                        <Input
                                            id="image-alt"
                                            placeholder="Add a description"
                                            value={imageAlt}
                                            onChange={(e) => setImageAlt(e.target.value)}
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="button" className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="btn-label">Label</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="btn-label"
                                                placeholder="Enter your label"
                                                value={buttonLabel}
                                                onChange={(e) => setButtonLabel(e.target.value)}
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
                            {/* 50ms for the dialog close animation to complete */}
                            <DialogFooter>
                                {accessory && (
                                    <DialogClose asChild>
                                        <Button
                                            variant={"destructive"}
                                            onClick={() =>
                                                setTimeout(() => {
                                                    removeAccessory?.();
                                                }, 50)
                                            }
                                        >
                                            <TrashIcon />
                                            Remove
                                        </Button>
                                    </DialogClose>
                                )}
                                <DialogClose asChild>
                                    <Button
                                        // onClick={() =>
                                        //     setTimeout(() => {
                                        //         if (accessory?.type === ComponentType.Thumbnail) {
                                        //             setAccessory?.({
                                        //                 type: ComponentType.Thumbnail,
                                        //                 media: { url: imageUrl },
                                        //                 description: imageAlt,
                                        //             });
                                        //         } else if (accessory?.type === ComponentType.Button) {
                                        //             const style = buttonTypeToButtonStyle(buttonStyle);

                                        //             if (style === ButtonStyle.Link) {
                                        //                 setAccessory?.({
                                        //                     type: ComponentType.Button,
                                        //                     label: buttonLabel,
                                        //                     style: style,
                                        //                     url: buttonUrl,
                                        //                 });
                                        //             } else {
                                        //                 setAccessory?.({
                                        //                     type: ComponentType.Button,
                                        //                     label: buttonLabel,
                                        //                     style: style,
                                        //                     custom_id: buttonActionId,
                                        //                 });
                                        //             }
                                        //         }
                                        //     }, 50)
                                        // }
                                        onClick={() => {
                                            if (tab === "thumbnail") {
                                                setAccessory?.({
                                                    type: ComponentType.Thumbnail,
                                                    media: { url: imageUrl },
                                                    description: imageAlt,
                                                });
                                            } else if (tab === "button") {
                                                setAccessory?.({
                                                    type: ComponentType.Button,
                                                    label: buttonLabel,
                                                    style: buttonTypeToButtonStyle(buttonStyle),
                                                    url: buttonUrl,
                                                    custom_id: buttonActionId,
                                                });
                                            }
                                        }}
                                        disabled={!isValid}
                                    >
                                        <CheckIcon />
                                        Save
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            >
                <Textarea
                    placeholder="The quick brown fox jumps over the lazy dog"
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                />
            </NewBuilder>
            <Dialog>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Accessory</DialogTitle>
                        <DialogDescription>Set the accessory for the text display.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Remove</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button>Set</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
