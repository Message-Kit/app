import { APIActionRowComponent, type APIButtonComponent, APIComponentInMessageActionRow, ButtonStyle, ComponentType } from "discord-api-types/v10";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    DotIcon,
    EditIcon,
    ExternalLinkIcon,
    PlusIcon,
    TrashIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { motionProps } from "@/lib/motion-props";
import { generateRandomNumber } from "@/lib/random-number";
import { moveItem, removeAt } from "@/lib/utils";
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

export default function ButtonGroup({
    onMoveUp,
    onMoveDown,
    onRemove,
    components,
    setComponents,
    component,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    components: APIButtonComponent[];
    setComponents: (components: APIButtonComponent[]) => void;
    component: APIActionRowComponent<APIComponentInMessageActionRow>;
}) {
    const [buttonLabel, setButtonLabel] = useState("");
    const [buttonStyle, setButtonStyle] = useState<"primary" | "secondary" | "success" | "danger" | "link">("primary");
    const [buttonUrl, setButtonUrl] = useState("");
    const [buttonActionId, setButtonActionId] = useState("");

    const isValid = useMemo(() => {
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
    }, [buttonStyle, buttonUrl, buttonActionId]);

    return (
        <NewBuilder
            name="Button Group"
            tag={component.id ?? null}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
            helperText={`(${components.length}/5)`}
            extraButton={
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="h-7 text-xs font-semibold text-muted-foreground"
                            disabled={components.length >= 5}
                        >
                            <PlusIcon />
                            Add Button
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Button</DialogTitle>
                            <DialogDescription>Set up label, style and target for the new button.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="btn-label">
                                    Label
                                    <span className="text-destructive">*</span>
                                </Label>
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
                            {buttonStyle === "link" ? (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="btn-url">
                                        URL
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="btn-url"
                                        placeholder="Enter your URL"
                                        inputMode="url"
                                        value={buttonUrl}
                                        onChange={(e) => setButtonUrl(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="btn-action-id">
                                        Action ID
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter your action ID"
                                        value={buttonActionId}
                                        id="btn-action-id"
                                        onChange={(e) => setButtonActionId(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    disabled={!isValid}
                                    onClick={() => {
                                        if (buttonStyle === "link") {
                                            setComponents([
                                                ...components,
                                                {
                                                    id: generateRandomNumber(),
                                                    type: ComponentType.Button,
                                                    label: buttonLabel,
                                                    style: ButtonStyle.Link,
                                                    url: buttonUrl,
                                                },
                                            ]);
                                        } else {
                                            setComponents([
                                                ...components,
                                                {
                                                    id: generateRandomNumber(),
                                                    type: ComponentType.Button,
                                                    label: buttonLabel,
                                                    style:
                                                        buttonStyle === "primary"
                                                            ? ButtonStyle.Primary
                                                            : buttonStyle === "secondary"
                                                              ? ButtonStyle.Secondary
                                                              : buttonStyle === "success"
                                                                ? ButtonStyle.Success
                                                                : ButtonStyle.Danger,
                                                    custom_id: buttonActionId,
                                                },
                                            ]);
                                        }
                                    }}
                                >
                                    <CheckIcon />
                                    Confirm
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="flex flex-col gap-2">
                <AnimatePresence>
                    {components
                        .filter((component) => component.style !== ButtonStyle.Premium)
                        .map((component, index) => {
                            return (
                                <motion.div {...motionProps} key={component.id}>
                                    <div className="rounded-lg border p-2 text-sm flex justify-between bg-input/15">
                                        <div className="flex gap-2 items-center">
                                            <Button className="size-7" variant={"ghost"} size={"icon"}>
                                                <EditIcon />
                                            </Button>
                                            <div className="flex gap-0.5 items-center">
                                                <span className="font-medium">{component.label}</span>
                                                <DotIcon size={16} className="text-muted-foreground" />
                                                <span className="text-muted-foreground font-medium">
                                                    {ButtonStyle[component.style]}
                                                </span>
                                                <DotIcon size={16} className="text-muted-foreground" />
                                                {component.style === ButtonStyle.Link ? (
                                                    <a
                                                        href={component.url}
                                                        className="text-muted-foreground underline underline-offset-2 flex gap-1.5 items-center hover:text-primary-foreground duration-100"
                                                    >
                                                        {component.url.replace(/^https?:\/\//, "")}
                                                        <ExternalLinkIcon className="size-4" />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">{component.custom_id}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <Button
                                                className="size-7"
                                                variant="ghost"
                                                onClick={() => {
                                                    setComponents(moveItem(components, index, "up"));
                                                }}
                                            >
                                                <ChevronUpIcon />
                                            </Button>
                                            <Button
                                                className="size-7"
                                                variant="ghost"
                                                onClick={() => {
                                                    setComponents(moveItem(components, index, "down"));
                                                }}
                                            >
                                                <ChevronDownIcon />
                                            </Button>
                                            <Button
                                                className="size-7"
                                                variant="ghost"
                                                onClick={() => {
                                                    setComponents(removeAt(components, index));
                                                }}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                </AnimatePresence>
            </div>
        </NewBuilder>
    );
}
