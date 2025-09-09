import type { APIMediaGalleryItem } from "discord-api-types/v10";
import { TrashIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAttachmentStore } from "@/lib/stores/attachments";
import { fileToBase64String } from "@/lib/to-base64";
import NewBuilder from "../new-builder";
import { Button } from "../ui/button";

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

const sanitizeFileName = (name: string) => name.trim().replace(/\s+/g, "_");

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [attachmentPreviewMap, setAttachmentPreviewMap] = useState<Record<string, string>>({});
    const previewMapRef = useRef<Record<string, string>>({});

    const isAtLimit = images.length >= 10;

    useEffect(() => {
        previewMapRef.current = attachmentPreviewMap;
    }, [attachmentPreviewMap]);

    useEffect(() => {
        return () => {
            Object.values(previewMapRef.current).forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    return (
        <NewBuilder
            name="Media Gallery"
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
            helperText={`(${images.length}/10)`}
            extraButton={
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
                    <input
                        className="hidden"
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.webp"
                        ref={fileInputRef}
                        disabled={isAtLimit}
                        onChange={(e) => {
                            const newFiles = e.target.files;
                            if (newFiles) {
                                if (images.length >= 10) {
                                    toast.error("Limit is 10 images!");
                                    e.currentTarget.value = "";
                                    return;
                                }

                                const MAX_BYTES = 8 * 1024 * 1024;
                                const filesArray = Array.from(newFiles);

                                const disallowed = filesArray.filter((f) => !ALLOWED_MIME_TYPES.has(f.type));
                                const allowed = filesArray.filter((f) => ALLOWED_MIME_TYPES.has(f.type));
                                if (disallowed.length > 0) {
                                    toast.warning("Some files are not PNG/JPG/JPEG/WEBP and were skipped");
                                }

                                const oversized = allowed.filter((f) => f.size > MAX_BYTES);
                                const withinSize = allowed.filter((f) => f.size <= MAX_BYTES);
                                if (oversized.length > 0) {
                                    toast.warning("Some files exceed 1 MB and were skipped");
                                }

                                const remainingSlots = Math.max(0, 10 - images.length);
                                const selected = withinSize.slice(0, remainingSlots);
                                if (withinSize.length > remainingSlots) {
                                    toast.error("Only up to 10 images allowed!");
                                }

                                if (selected.length === 0) {
                                    e.currentTarget.value = "";
                                    return;
                                }

                                const newItems = selected.map((file) => ({
                                    media: { url: `attachment://${sanitizeFileName(file.name)}` },
                                    description: "yes",
                                    spoiler: false,
                                }));

                                const entries = selected.map(
                                    (file) =>
                                        [
                                            `attachment://${sanitizeFileName(file.name)}`,
                                            URL.createObjectURL(file),
                                        ] as const,
                                );

                                setAttachmentPreviewMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
                                setImages([...images, ...newItems]);

                                Promise.all(selected.map((f) => fileToBase64String(f))).then((base64s) => {
                                    const payloads = selected.map((file, i) => ({
                                        key: `attachment://${sanitizeFileName(file.name)}`,
                                        name: sanitizeFileName(file.name),
                                        mimeType: file.type || "application/octet-stream",
                                        dataBase64: base64s[i],
                                    }));
                                    useAttachmentStore.getState().addMany(payloads);
                                });

                                e.currentTarget.value = "";
                            }
                        }}
                    />
                </Button>
            }
        >
            {images.length !== 0 ? (
                <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${Math.max(4, Math.min(images.length, 5))}, 1fr)` }}
                >
                    {images.map((image, index) => {
                        const resolvedSrc = image.media.url.startsWith("attachment://")
                            ? attachmentPreviewMap[image.media.url]
                            : image.media.url;
                        return (
                            <div
                                key={`${image.media.url}-${index}`}
                                className="bg-accent relative aspect-square rounded-md overflow-hidden"
                            >
                                {resolvedSrc ? (
                                    // biome-ignore lint/performance/noImgElement: no
                                    <img
                                        src={resolvedSrc}
                                        className="size-full object-cover"
                                        alt="Media Gallery"
                                        width={256}
                                        height={256}
                                    />
                                ) : null}
                                <Button
                                    variant={"destructive"}
                                    size={"icon"}
                                    className="size-7 absolute top-2 right-2"
                                    onClick={() => {
                                        const url = images[index].media.url;
                                        if (url.startsWith("attachment://")) {
                                            const preview = attachmentPreviewMap[url];
                                            if (preview) {
                                                URL.revokeObjectURL(preview);
                                                setAttachmentPreviewMap((prev) => {
                                                    const { [url]: _removed, ...rest } = prev;
                                                    return rest;
                                                });
                                            }
                                            useAttachmentStore.getState().remove(url);
                                        }
                                        setImages(images.filter((_, i) => i !== index));
                                    }}
                                >
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
