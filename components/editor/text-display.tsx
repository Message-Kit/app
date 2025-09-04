import { PlusIcon } from "lucide-react";
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
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

export default function TextDisplay({
    content,
    onContentChange,
    onMoveUp,
    onMoveDown,
    onRemove,
}: {
    content: string;
    onContentChange: (content: string) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
}) {
    return (
        <>
            <NewBuilder
                name="Text Display"
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onRemove={onRemove}
                extraButton={
                    <Button variant={"ghost"} size={"sm"} className="h-7 text-xs font-semibold text-muted-foreground">
                        <PlusIcon />
                        Set Accessory
                    </Button>
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
