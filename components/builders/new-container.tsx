import { ChevronDown, ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function NewContainer({
    children,
    onMoveUp,
    onMoveDown,
    onDelete,
    addTrigger,
}: PropsWithChildren & {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    addTrigger: ReactNode;
}) {
    return (
        <div className="flex flex-col border rounded-xl bg-card">
            <div className="px-2 py-2 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronDown />
                    </Button>
                    <div className="flex gap-4 items-center">
                        <span className="font-semibold text-sm text-accent-foreground">Container</span>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    {addTrigger}
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
            {children && (
                <>
                    <Separator />
                    <div className="p-4 flex flex-col gap-4">{children}</div>
                </>
            )}
        </div>
    );
}
