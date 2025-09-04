import { type APISectionAccessoryComponent, ComponentType } from "discord-api-types/v10";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
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
    const [_accessoryInfo, _setAccessoryInfo] = useState<APISectionAccessoryComponent | null>(accessory ?? null);

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
                            >
                                <PlusIcon />
                                {accessory ? "Edit" : "Add"} Accessory
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Set Accessory</DialogTitle>
                                <DialogDescription>Set the accessory for the text display.</DialogDescription>
                            </DialogHeader>
                            {accessory?.type}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant={"destructive"} onClick={removeAccessory}>
                                        Remove
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        onClick={() =>
                                            setAccessory?.({
                                                type: ComponentType.Thumbnail,
                                                media: { url: "https://github.com/ronykax.png" },
                                                description: "some cool description",
                                            })
                                        }
                                    >
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
