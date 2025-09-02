import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIComponentInMessageActionRow,
    type APIEmoji,
    type APIMessageComponentEmoji,
    ButtonStyle,
    ComponentType,
} from "discord-api-types/v10";
import { ChevronDown, ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
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
// removed unused select imports
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";

export default function NewButtonGroup({
    buttons,
    onMoveUp,
    onMoveDown,
    onDelete,
    onChangeButtons,
    guildId,
}: {
    buttons: APIActionRowComponent<APIComponentInMessageActionRow>["components"];
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    onChangeButtons: (next: APIActionRowComponent<APIComponentInMessageActionRow>["components"]) => void;
    guildId: string;
}) {
    type NonPremiumButton = Exclude<APIButtonComponent, { style: ButtonStyle.Premium }>;

    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [style, setStyle] = useState<"primary" | "secondary" | "success" | "danger" | "link">("primary");
    const [label, setLabel] = useState("");
    const [emoji, setEmoji] = useState<APIMessageComponentEmoji | null>(null);
    const [actionId, setActionId] = useState("");
    const [url, setUrl] = useState("");

    const styleToEnum = useMemo(
        () => ({
            primary: ButtonStyle.Primary,
            secondary: ButtonStyle.Secondary,
            success: ButtonStyle.Success,
            danger: ButtonStyle.Danger,
            link: ButtonStyle.Link,
        }),
        [],
    );

    const enumToStyle = (s: ButtonStyle): "primary" | "secondary" | "success" | "danger" | "link" => {
        switch (s) {
            case ButtonStyle.Primary:
                return "primary";
            case ButtonStyle.Secondary:
                return "secondary";
            case ButtonStyle.Success:
                return "success";
            case ButtonStyle.Danger:
                return "danger";
            default:
                return "link";
        }
    };

    function resetForm() {
        setEditingIndex(null);
        setStyle("primary");
        setLabel("");
        setEmoji(null);
        setActionId("");
        setUrl("");
    }

    function openForAdd() {
        resetForm();
        setOpen(true);
    }

    function openForEdit(index: number, btn: NonPremiumButton) {
        setEditingIndex(index);
        setStyle(enumToStyle(btn.style));
        setLabel(btn.label ?? "");
        setEmoji(btn.emoji ?? null);
        if (btn.style === ButtonStyle.Link) {
            setUrl((btn as APIButtonComponent & { url?: string }).url ?? "");
            setActionId("");
        } else {
            setActionId(btn.custom_id ?? "");
            setUrl("");
        }
        setOpen(true);
    }

    function handleSave() {
        const mappedStyle = styleToEnum[style];
        const base: Partial<APIButtonComponent> = {
            type: ComponentType.Button,
            style: mappedStyle,
            label,
        } as APIButtonComponent;

        const nextButton: APIButtonComponent = {
            ...base,
            ...(mappedStyle === ButtonStyle.Link ? { url } : { custom_id: actionId }),
            ...(emoji ? { emoji } : {}),
        } as APIButtonComponent;

        const next = [...buttons];
        if (editingIndex === null) {
            next.push(nextButton);
        } else {
            next[editingIndex] = nextButton;
        }
        onChangeButtons(next);
        setOpen(false);
        resetForm();
    }

    return (
        <div className="flex flex-col border rounded-xl bg-card">
            <div className="px-2 py-2 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronDown />
                    </Button>
                    <div className="flex gap-4 items-center">
                        <span className="font-semibold text-sm text-accent-foreground">Button Group</span>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                onClick={openForAdd}
                                className="font-body font-semibold underline underline-offset-2 px-2 text-muted-foreground hover:text-primary-foreground text-xs"
                            >
                                Add Button
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Button</DialogTitle>
                                <DialogDescription>Add a button to the button group.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="btn-label">Label</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="btn-label"
                                            placeholder="Enter your label"
                                            value={label}
                                            onChange={(e) => setLabel(e.target.value)}
                                        />
                                        <EmojiPicker
                                            guildId={guildId}
                                            emoji={emoji}
                                            onEmojiSelect={(e: APIEmoji) =>
                                                setEmoji({
                                                    id: e.id ?? undefined,
                                                    name: e.name ?? undefined,
                                                    animated: e.animated,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <RadioGroup
                                    value={style}
                                    onValueChange={(v) => setStyle(v as typeof style)}
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
                                {style === "link" ? (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="btn-url">URL</Label>
                                        <Input
                                            id="btn-url"
                                            placeholder="Enter your URL"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="btn-action-id">Action ID</Label>
                                        <Input
                                            placeholder="Enter your action ID"
                                            value={actionId}
                                            id="btn-action-id"
                                            onChange={(e) => setActionId(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button onClick={handleSave}>{editingIndex === null ? "Add" : "Save"}</Button>
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
            <div className="flex gap-2 p-4">
                {buttons.length === 0 ? (
                    <div className="text-sm text-muted-foreground flex items-center justify-center size-full">
                        No buttons in this group.
                    </div>
                ) : (
                    buttons
                        .filter((b): b is APIButtonComponent => b.type === ComponentType.Button)
                        .filter((button): button is NonPremiumButton => button.style !== ButtonStyle.Premium)
                        .map((button, index) => (
                            <Button
                                variant="outlineDashed"
                                key={`${index}-${button.style}`}
                                onClick={() => openForEdit(index, button)}
                            >
                                {button.label}
                            </Button>
                        ))
                )}
            </div>
        </div>
    );
}
