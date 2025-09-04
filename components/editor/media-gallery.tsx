import type { APIMediaGalleryItem } from "discord-api-types/v10";
import { TrashIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import NewBuilder from "../new-builder";
import { Button } from "../ui/button";

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
    return (
        <NewBuilder
            name="Media Gallery"
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
            extraButton={
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="h-7 text-xs font-semibold text-muted-foreground"
                    onClick={() => {
                        setImages([
                            ...images,
                            {
                                media: { url: "https://github.com/ronykax.png" },
                                description: "some cool description",
                                spoiler: false,
                            },
                        ]);
                    }}
                >
                    <UploadIcon />
                    Upload Media
                </Button>
            }
        >
            {images.length !== 0 ? (
                <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${Math.max(4, Math.min(images.length, 5))}, 1fr)` }}
                >
                    {images.map((image, index) => (
                        <div
                            key={`${image.media.url}-${index}`}
                            className="bg-accent relative aspect-square rounded-md overflow-hidden"
                        >
                            <Image
                                src={image.media.url}
                                className="size-full"
                                alt="Media Gallery"
                                width={256}
                                height={256}
                            />
                            <Button
                                variant={"destructive"}
                                size={"icon"}
                                className="size-7 absolute top-2 right-2"
                                onClick={() => {
                                    setImages(images.filter((_, i) => i !== index));
                                }}
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-muted-foreground text-sm flex items-center justify-center p-4">
                    Upload images to the media gallery
                </div>
            )}
        </NewBuilder>
    );
}
