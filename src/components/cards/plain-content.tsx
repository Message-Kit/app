import { useId, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Check, ChevronDown, ChevronUp, Ellipsis, ImageIcon, MousePointerClick, Trash } from "lucide-react";
import LabelSelect from "../label-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AccessoryType, type Accessory } from "@/types";
import { ButtonStyle } from "discord-api-types/v10";
import { useEffect } from "react";
import LabelInput from "../label-input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Props {
    content: string;
    accessory?: Accessory | null;
    setContent: (message: string) => void;
    setAccessory: (accessory: Accessory | null) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onDelete?: () => void;
}

export default function PlainContent({ content, accessory, setContent, setAccessory, onMoveUp, onMoveDown, onDelete }: Props) {
    const id2 = useId();
    const id3 = useId();
    const id4 = useId();
    const id5 = useId();

    const [selectedAccessoryType, setSelectedAccessoryType] = useState<AccessoryType | null>(null);

    const [buttonLabel, setButtonLabel] = useState("");
    const [buttonStyle, setButtonStyle] = useState<ButtonStyle | undefined>(undefined);
    const [buttonCustomId, setButtonCustomId] = useState<string>("");
    const [buttonUrl, setButtonUrl] = useState<string>("");

    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!accessory) return setSelectedAccessoryType(null);
        if (accessory.type === AccessoryType.Button) {
            setSelectedAccessoryType(AccessoryType.Button);
            setButtonLabel(accessory.value.label ?? "");
            setButtonStyle(accessory.value.style);
            setButtonCustomId(accessory.value.customId ?? "");
            setButtonUrl(accessory.value.url ?? "");
            return;
        }
        if (accessory.type === AccessoryType.Image) {
            setSelectedAccessoryType(AccessoryType.Image);
            setImageUrl(accessory.value.url);
            setImageAlt(accessory.value.alt);
            return;
        }
        setSelectedAccessoryType(null);
    }, [accessory]);

    return (
        <>
            <div className="rounded-xl border bg-card">
                <div className="flex gap-2 items-center justify-between p-4">
                    <div className="flex gap-2 items-center">
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            className="size-7"
                            aria-expanded={!isCollapsed}
                            onClick={() => setIsCollapsed((prev) => !prev)}
                        >
                            {isCollapsed ? <ChevronDown /> : <ChevronUp />}
                        </Button>
                        <div className="flex gap-2 items-end">
                            <span className="font-bold">Plain Content</span>
                            <span className="text-muted-foreground font-bold">({content.length}/4096)</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size={"icon"} variant={"ghost"}>
                                    <Ellipsis />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={onMoveUp}>
                                    <ChevronUp />
                                    Move Up
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onMoveDown}>
                                    <ChevronDown />
                                    Move Down
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash className="text-destructive" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={accessory ? "outline-dashed" : "outline-dashed"}>
                                    {accessory?.type === AccessoryType.Image ? (
                                        <Check />
                                    ) : accessory?.type === AccessoryType.Button ? (
                                        <Check />
                                    ) : null}
                                    {accessory?.type === AccessoryType.Button
                                        ? "Accessory"
                                        : accessory?.type === AccessoryType.Image
                                        ? "Accessory"
                                        : "Set Accessory"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Set Accessory</DialogTitle>
                                    <DialogDescription>Add an inline accessory to this message section.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-6">
                                    <LabelSelect id={id2} label="Accessory" required>
                                        <Select
                                            onValueChange={(value) => {
                                                const nextType = Number(value) as AccessoryType;
                                                setSelectedAccessoryType(nextType);
                                            }}
                                            value={selectedAccessoryType !== null ? String(selectedAccessoryType) : undefined}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an accessory" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={String(AccessoryType.Button)}>
                                                    <MousePointerClick />
                                                    Button
                                                </SelectItem>
                                                <SelectItem value={String(AccessoryType.Image)}>
                                                    <ImageIcon />
                                                    Image
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </LabelSelect>

                                    {/* dependant params */}
                                    {selectedAccessoryType === AccessoryType.Button ? (
                                        <>
                                            <LabelInput
                                                id={id3}
                                                label="Label"
                                                placeholder="Enter your label"
                                                value={buttonLabel}
                                                setValue={setButtonLabel}
                                                required
                                            />
                                            <LabelSelect id={id4} label="Style" required>
                                                <Select
                                                    value={(() => {
                                                        switch (buttonStyle) {
                                                            case ButtonStyle.Primary:
                                                                return "primary";
                                                            case ButtonStyle.Secondary:
                                                                return "secondary";
                                                            case ButtonStyle.Success:
                                                                return "success";
                                                            case ButtonStyle.Danger:
                                                                return "danger";
                                                            case ButtonStyle.Link:
                                                                return "link";
                                                            default:
                                                                return undefined;
                                                        }
                                                    })()}
                                                    onValueChange={(value) => {
                                                        const map: Record<string, ButtonStyle> = {
                                                            primary: ButtonStyle.Primary,
                                                            secondary: ButtonStyle.Secondary,
                                                            success: ButtonStyle.Success,
                                                            danger: ButtonStyle.Danger,
                                                            link: ButtonStyle.Link,
                                                        };
                                                        setButtonStyle(map[value]);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a style" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="primary">Primary</SelectItem>
                                                        <SelectItem value="secondary">Secondary</SelectItem>
                                                        <SelectItem value="success">Success</SelectItem>
                                                        <SelectItem value="danger">Danger</SelectItem>
                                                        <SelectItem value="link">Link</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </LabelSelect>
                                            {buttonStyle === ButtonStyle.Link ? (
                                                <LabelInput
                                                    id={id5}
                                                    label="URL"
                                                    placeholder="https://example.com"
                                                    value={buttonUrl}
                                                    setValue={setButtonUrl}
                                                    required
                                                />
                                            ) : (
                                                <LabelSelect id={id5} label="Action" required>
                                                    <Select value={buttonCustomId || undefined} onValueChange={setButtonCustomId}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select an action" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* the value here is the custom ID of the action */}
                                                            <SelectItem value="m6qQ4Tw7Xf">action 1</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </LabelSelect>
                                            )}
                                        </>
                                    ) : selectedAccessoryType === AccessoryType.Image ? (
                                        <>
                                            <LabelInput
                                                id={id3 + "-img"}
                                                label="Image URL"
                                                placeholder="https://example.com/image.png"
                                                value={imageUrl}
                                                setValue={setImageUrl}
                                                required
                                            />
                                            <LabelInput
                                                id={id3 + "-img-alt"}
                                                label="Alt Text"
                                                placeholder="Enter your alt text"
                                                value={imageAlt}
                                                setValue={setImageAlt}
                                            />
                                        </>
                                    ) : null}
                                </div>

                                {/* footer */}
                                <DialogFooter>
                                    {selectedAccessoryType !== null && (
                                        <DialogClose asChild>
                                            <Button variant="destructive" onClick={() => setAccessory(null)}>
                                                <Trash />
                                                Remove
                                            </Button>
                                        </DialogClose>
                                    )}
                                    <DialogClose asChild>
                                        <Button
                                            disabled={
                                                selectedAccessoryType === null ||
                                                (selectedAccessoryType === AccessoryType.Button
                                                    ? (buttonStyle === ButtonStyle.Link
                                                        ? !(buttonLabel.trim() && buttonUrl.trim())
                                                        : !(buttonLabel.trim() && buttonCustomId.trim() && buttonStyle !== undefined))
                                                    : selectedAccessoryType === AccessoryType.Image
                                                    ? !imageUrl
                                                    : false)
                                            }
                                            onClick={() => {
                                                if (selectedAccessoryType === AccessoryType.Button) {
                                                    if (buttonStyle === ButtonStyle.Link) {
                                                        if (!buttonLabel.trim() || !buttonUrl.trim()) return;
                                                        setAccessory({
                                                            type: AccessoryType.Button,
                                                            value: {
                                                                label: buttonLabel,
                                                                style: ButtonStyle.Link,
                                                                customId: "",
                                                                url: buttonUrl,
                                                            },
                                                        });
                                                    } else {
                                                        if (!buttonLabel.trim() || !buttonCustomId.trim() || buttonStyle === undefined) return;
                                                        setAccessory({
                                                            type: AccessoryType.Button,
                                                            value: {
                                                                label: buttonLabel,
                                                                style: buttonStyle as ButtonStyle,
                                                                customId: buttonCustomId,
                                                                url: buttonUrl,
                                                            },
                                                        });
                                                    }
                                                } else if (selectedAccessoryType === AccessoryType.Image) {
                                                    if (!imageUrl) return;
                                                    setAccessory({
                                                        type: AccessoryType.Image,
                                                        value: {
                                                            url: imageUrl,
                                                            alt: imageAlt || "",
                                                        },
                                                    });
                                                }
                                            }}
                                        >
                                            <Check />
                                            Confirm
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* everything below is collapsible including the separator */}
                {!isCollapsed && (
                    <>
                        <Separator />
                        <div className="p-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="plain-message" className="sr-only">
                                    Message
                                </Label>
                                <Textarea
                                    id="plain-message"
                                    placeholder="Enter your message"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete component?</DialogTitle>
                        <DialogDescription>This will remove this component.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="destructive" onClick={onDelete}>
                                Confirm
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
