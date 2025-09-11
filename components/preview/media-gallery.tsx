import type { APIMediaGalleryComponent } from "discord-api-types/v10";
import { memo, useEffect, useState } from "react";
import { useFiles } from "@/lib/stores/files";
import { cn, sanitizeFileName } from "@/lib/utils";
import { useHoveredComponentStore } from "@/lib/stores/hovered-component";

type PreviewMediaTileProps = {
    mediaUrl: string;
    description?: string | null;
    aspect: "square" | "video" | "auto";
    className?: string;
};

const PreviewMediaTile = memo(function PreviewMediaTile({
    mediaUrl,
    description,
    aspect,
    className,
}: PreviewMediaTileProps) {
    const { hoveredComponent } = useHoveredComponentStore();

    const { files } = useFiles();
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (mediaUrl.startsWith("attachment://")) {
            const filename = mediaUrl.split("/").pop();
            const file = filename ? files.find((f) => sanitizeFileName(f.name) === filename) : undefined;

            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setUrl(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            }

            setUrl(null);
            return;
        }

        setUrl(mediaUrl);
    }, [mediaUrl, files]);

    if (!url) return null;

    return (
        <div
            className={`rounded-[4px] overflow-hidden ${aspect === "video" ? "aspect-video" : aspect === "square" ? "aspect-square" : ""} ${className ?? ""}`}
        >
            {/* biome-ignore lint/performance/noImgElement: image preview */}
            <img
                src={url}
                className={`${aspect === "auto" ? "w-full h-auto" : "size-full"} object-cover`}
                alt={description ?? "image"}
                width={256}
                height={256}
            />
        </div>
    );
});

export default function PreviewMediaGallery({
    component,
    container,
}: {
    component: APIMediaGalleryComponent;
    container?: boolean;
}) {
    const { hoveredComponent } = useHoveredComponentStore();

    const items = component.items;
    const count = items.length;

    if (count <= 0) return null;

    if (count === 1) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                <PreviewMediaTile mediaUrl={items[0].media.url} description={items[0].description} aspect="auto" />
            </div>
        );
    }

    if (count === 2) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden grid grid-cols-2 gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                {items.map((item, i) => (
                    <PreviewMediaTile
                        key={`${item.media.url}-${i}`}
                        mediaUrl={item.media.url}
                        description={item.description}
                        aspect="square"
                    />
                ))}
            </div>
        );
    }

    if (count === 3) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden grid grid-cols-3 grid-rows-2 gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                <div className="col-span-2 row-span-2">
                    <PreviewMediaTile
                        mediaUrl={items[0].media.url}
                        description={items[0].description}
                        aspect="square"
                    />
                </div>
                <PreviewMediaTile
                    key={`${items[1].media.url}-1`}
                    mediaUrl={items[1].media.url}
                    description={items[1].description}
                    aspect="square"
                />
                <PreviewMediaTile
                    key={`${items[2].media.url}-2`}
                    mediaUrl={items[2].media.url}
                    description={items[2].description}
                    aspect="square"
                />
            </div>
        );
    }

    if (count === 4) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden grid grid-cols-2 gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                {items.map((item, i) => (
                    <PreviewMediaTile
                        key={`${item.media.url}-${i}`}
                        mediaUrl={item.media.url}
                        description={item.description}
                        aspect="video"
                    />
                ))}
            </div>
        );
    }

    if (count === 5) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden flex flex-col gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                <div className="grid grid-cols-2 gap-[4px]">
                    <PreviewMediaTile
                        key={`${items[0].media.url}-0`}
                        mediaUrl={items[0].media.url}
                        description={items[0].description}
                        aspect="square"
                    />
                    <PreviewMediaTile
                        key={`${items[1].media.url}-1`}
                        mediaUrl={items[1].media.url}
                        description={items[1].description}
                        aspect="square"
                    />
                </div>
                <div className="grid grid-cols-3 gap-[4px]">
                    <PreviewMediaTile
                        key={`${items[2].media.url}-2`}
                        mediaUrl={items[2].media.url}
                        description={items[2].description}
                        aspect="square"
                    />
                    <PreviewMediaTile
                        key={`${items[3].media.url}-3`}
                        mediaUrl={items[3].media.url}
                        description={items[3].description}
                        aspect="square"
                    />
                    <PreviewMediaTile
                        key={`${items[4].media.url}-4`}
                        mediaUrl={items[4].media.url}
                        description={items[4].description}
                        aspect="square"
                    />
                </div>
            </div>
        );
    }

    if (count === 6) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden grid grid-cols-3 gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                {items.map((item, i) => (
                    <PreviewMediaTile
                        key={`${item.media.url}-${i}`}
                        mediaUrl={item.media.url}
                        description={item.description}
                        aspect="square"
                    />
                ))}
            </div>
        );
    }

    if (count === 7) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden flex flex-col gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                <PreviewMediaTile
                    key={`${items[0].media.url}-0`}
                    mediaUrl={items[0].media.url}
                    description={items[0].description}
                    aspect="video"
                />
                <div className="grid grid-cols-3 gap-[4px]">
                    {items.slice(1).map((item, i) => (
                        <PreviewMediaTile
                            key={`${item.media.url}-${i + 1}`}
                            mediaUrl={item.media.url}
                            description={item.description}
                            aspect="square"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (count === 8) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden flex flex-col gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                <div className="grid grid-cols-2 gap-[4px]">
                    <PreviewMediaTile
                        key={`${items[0].media.url}-0`}
                        mediaUrl={items[0].media.url}
                        description={items[0].description}
                        aspect="square"
                    />
                    <PreviewMediaTile
                        key={`${items[1].media.url}-1`}
                        mediaUrl={items[1].media.url}
                        description={items[1].description}
                        aspect="square"
                    />
                </div>
                <div className="grid grid-cols-3 gap-[4px]">
                    {items.slice(2).map((item, i) => (
                        <PreviewMediaTile
                            key={`${item.media.url}-${i + 2}`}
                            mediaUrl={item.media.url}
                            description={item.description}
                            aspect="square"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (count === 9) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden grid grid-cols-3 gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                {items.map((item, i) => (
                    <PreviewMediaTile
                        key={`${item.media.url}-${i}`}
                        mediaUrl={item.media.url}
                        description={item.description}
                        aspect="square"
                    />
                ))}
            </div>
        );
    }

    if (count === 10) {
        return (
            <div
                className={cn(
                    "rounded-[8px] overflow-hidden flex flex-col gap-[4px]",
                    hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]",
                )}
                style={{ maxWidth: container ? "100%" : "550px" }}
            >
                <PreviewMediaTile
                    key={`${items[0].media.url}-0`}
                    mediaUrl={items[0].media.url}
                    description={items[0].description}
                    aspect="video"
                />
                <div className="grid grid-cols-3 gap-[4px]">
                    {items.slice(1).map((item, i) => (
                        <PreviewMediaTile
                            key={`${item.media.url}-${i + 1}`}
                            mediaUrl={item.media.url}
                            description={item.description}
                            aspect="square"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // fallback: simple grid
    return (
        <div
            className="rounded-[8px] overflow-hidden grid grid-cols-3 gap-[4px]"
            style={{ maxWidth: container ? "100%" : "550px" }}
        >
            {items.map((item, i) => (
                <PreviewMediaTile
                    key={`${item.media.url}-${i}`}
                    mediaUrl={item.media.url}
                    description={item.description}
                    aspect="square"
                />
            ))}
        </div>
    );
}
