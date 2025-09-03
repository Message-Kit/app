import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { RESTAPIAttachment } from "discord-api-types/v10";

export default function MediaGallery({
    onMoveUp,
    onMoveDown,
    onDelete,
    attachments,
    setAttachments,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    attachments: RESTAPIAttachment[];
    setAttachments: (attachments: RESTAPIAttachment[]) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        setAttachments(
            files.map((file, index) => ({
                id: index,
                filename: file.name,
            })),
        );
    }, [files, setAttachments]);

    return (
        <div className="flex flex-col border rounded-xl bg-card overflow-hidden">
            <div className="px-2 py-2 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronDownIcon />
                    </Button>
                    <div className="flex gap-2">
                        <span className="font-semibold text-sm text-accent-foreground">Media Gallery</span>
                        <span className="text-muted-foreground text-sm font-semibold">{attachments.length}/8</span>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <button
                        type="button"
                        className="font-body font-semibold underline underline-offset-2 px-2 text-muted-foreground hover:text-primary-foreground text-xs"
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            className="hidden"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            multiple
                            onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
                        />
                        Add Media
                    </button>
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
            <div className="flex flex-wrap gap-2 p-4">
                {files.map((file) => (
                    <div key={file.name} className="bg-accent relative aspect-square rounded-md overflow-hidden">
                        <Image
                            width={256}
                            height={256}
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="size-[200px] object-cover"
                        />
                        <div className="absolute top-0 right-0 p-2">
                            <Button
                                variant={"secondary"}
                                size={"icon"}
                                className="size-7 hover:text-destructive"
                                onClick={() => setFiles((prev) => prev.filter((f) => f.name !== file.name))}
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
