import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Trash, ChevronUp, ChevronDown, Ellipsis, EyeOff, Eye } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { useState } from "react";

interface Props {
    visible: boolean;
    size: "small" | "large";
    onChange: (value: { visible: boolean; size: "small" | "large" }) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onDelete?: () => void;
}

export default function CoolSeparator({ visible, size, onChange, onMoveUp, onMoveDown, onDelete }: Props) {
    const current = `${visible ? "visible" : "hidden"}-${size}` as const;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                            <span className="font-bold">Separator</span>
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
                    </div>
                </div>

                {/* everything below is collapsible including the separator */}
                {!isCollapsed && (
                    <>
                        <Separator />
                        <div className="p-4">
                            <Tabs
                                value={current}
                                onValueChange={(value) => {
                                    const [v, s] = value.split("-") as ["visible" | "hidden", "small" | "large"];
                                    onChange({ visible: v === "visible", size: s });
                                }}
                                className="w-full"
                            >
                                <TabsList className="w-full">
                                    <TabsTrigger value="hidden-large" className="w-full">
                                        <EyeOff />
                                        Hidden Large
                                    </TabsTrigger>
                                    <TabsTrigger value="visible-large" className="w-full">
                                        <Eye />
                                        Visible Large
                                    </TabsTrigger>
                                    <TabsTrigger value="hidden-small" className="w-full">
                                        <EyeOff />
                                        Hidden Small
                                    </TabsTrigger>
                                    <TabsTrigger value="visible-small" className="w-full">
                                        <Eye />
                                        Visible Small
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
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
