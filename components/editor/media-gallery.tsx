import type { APIMediaGalleryItem } from "discord-api-types/v10";
import { ImagePlusIcon, LinkIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useFiles } from "@/lib/stores/files";
import { sanitizeFileName } from "@/lib/utils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function MediaGallery({
    onMoveUp,
    onMoveDown,
    onRemove,
    images,
    setImages,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    images: APIMediaGalleryItem[];
    setImages: (images: APIMediaGalleryItem[]) => void;
}) {
    const isAtLimit = images.length >= 10;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<"link" | "upload">("link");
    const [linkUrl, setLinkUrl] = useState("");
    const { files, setFiles } = useFiles();

    const handleFileUpload = () => {
        const newFiles = fileInputRef.current?.files;
        if (!newFiles) return;

        if (newFiles.length >= 10) {
            toast.error("You can only upload a maximum of 10 files.");
            return;
        }

        setFiles([...files, ...Array.from(newFiles)]);
        setImages([
            ...images,
            ...Array.from(newFiles).map((file) => ({
                media: { url: `attachment://${sanitizeFileName(file.name)}` },
            })),
        ]);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleLinkUpload = () => {
        setImages([...images, { media: { url: linkUrl } }]);
        setLinkUrl("");
    };

    const handleHandle = () => {
        if (tab === "link") {
            handleLinkUpload();
        }
        if (tab === "upload") {
            handleFileUpload();
        }
    };

    useEffect(() => {
        console.log(images);
    }, [images]);

    const urls = useObjectUrls(images, files);

    return (
        <NewBuilder
            name="Media Gallery"
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
            helperText={`(${images.length}/10)`}
            extraButton={
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="h-7 text-xs font-semibold text-muted-foreground"
                            disabled={isAtLimit}
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                        >
                            <UploadIcon />
                            Upload Media
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Media</DialogTitle>
                            <DialogDescription>Upload images to the media gallery</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Tabs
                                defaultValue="link"
                                value={tab}
                                onValueChange={(value) => setTab(value as "link" | "upload")}
                            >
                                <TabsList className="mb-4 w-full h-10">
                                    <TabsTrigger value="link">
                                        <LinkIcon />
                                        Link
                                    </TabsTrigger>
                                    <TabsTrigger value="upload">
                                        <ImagePlusIcon />
                                        Upload
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="link" className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Image
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Enter your image URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Description (Alt Text)</Label>
                                        <Input placeholder="Add a description" />
                                    </div>
                                </TabsContent>
                                <TabsContent value="upload">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Image(s)
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Enter your image URL"
                                            type="file"
                                            ref={fileInputRef}
                                            disabled={isAtLimit}
                                            multiple
                                            accept=".png,.jpg,.jpeg,.webp"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button onClick={handleHandle}>Upload</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            {images.length !== 0 ? (
                <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${Math.max(3, Math.min(images.length, 5))}, 1fr)` }}
                >
                    {images.map((image, index) => {
                        const url = urls[index];
                        if (!url) return null;

                        return (
                            <div
                                key={`${image.media.url}-${index}`}
                                className="bg-accent relative aspect-square rounded-md overflow-hidden"
                            >
                                {/* biome-ignore lint/performance/noImgElement: no */}
                                <img
                                    src={url}
                                    className="size-full object-cover"
                                    alt="Media Gallery"
                                    width={256}
                                    height={256}
                                />
                                <Button variant={"destructive"} size={"icon"} className="size-7 absolute top-2 right-2">
                                    <TrashIcon />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-muted-foreground text-sm flex items-center justify-center p-4">
                    Upload images to the media gallery
                </div>
            )}
        </NewBuilder>
    );
}

function useObjectUrls(images: APIMediaGalleryItem[], files: File[]) {
    const cacheRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        const neededKeys = new Set<string>();

        // create URLs for files we need now
        images.forEach((image) => {
            if (!image.media.url.startsWith("attachment://")) return;
            const file = files.find((f) => sanitizeFileName(f.name) === image.media.url.split("/").pop());
            if (!file) return;
            const key = sanitizeFileName(file.name);
            neededKeys.add(key);
            if (!cacheRef.current.has(key)) {
                const obj = URL.createObjectURL(file);
                cacheRef.current.set(key, obj);
            }
        });

        // revoke any cached URLs that are no longer needed
        for (const key of Array.from(cacheRef.current.keys())) {
            if (!neededKeys.has(key)) {
                URL.revokeObjectURL(cacheRef.current.get(key) ?? "");
                cacheRef.current.delete(key);
            }
        }

        // cleanup on unmount
        return () => {
            for (const url of cacheRef.current.values()) URL.revokeObjectURL(url);
            cacheRef.current.clear();
        };
    }, [images, files]);

    // return urls aligned with `images` order (or null)
    return images.map((image) => {
        if (!image.media.url.startsWith("attachment://")) return image.media.url;
        const file = files.find((f) => sanitizeFileName(f.name) === image.media.url.split("/").pop());
        if (!file) return null;
        return cacheRef.current.get(sanitizeFileName(file.name)) ?? null;
    });
}
