import { Trash, ChevronUp, ChevronDown, Ellipsis, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

interface Props {
    urls: string[];
    setUrls: (urls: string[]) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onDelete?: () => void;
}

export default function MediaGallery({ urls, setUrls, onMoveUp, onMoveDown, onDelete }: Props) {
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
                            <span className="font-bold">Media Gallery</span>
                            <span className="text-muted-foreground font-bold">({urls.length}/24)</span>
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
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                const url = "https://picsum.photos/1920/1080";
                                if (url) {
                                    setUrls([...urls, url]);
                                }
                            }}
                        >
                            <Upload />
                            Upload Media
                        </Button>
                    </div>
                </div>

                {/* everything below is collapsible including the separator */}
                {!isCollapsed && (
                    <>
                        <Separator />
                        <div className="p-4 grid gap-2 grid-cols-4">
                            {urls.length > 0 ? (
                                urls.map((item, index) => (
                                    <div className="rounded-lg overflow-hidden" key={index}>
                                        <Image src={item} alt="Media" width={1920} height={1080} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 flex justify-center items-center h-full">
                                    <p className="text-muted-foreground text-sm">No media uploaded :(</p>
                                </div>
                            )}
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