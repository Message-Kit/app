import type { APIMediaGalleryComponent } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import useFilesStore from "@/lib/stores/files";
import { sanitizeFileName } from "@/lib/utils";

export default function PreviewMediaGallery({ component }: { component: APIMediaGalleryComponent }) {
    type MediaItem = (typeof items)[number];

    const { files } = useFilesStore();
    const items = component.items;

    const Tile = ({
        item,
        aspect,
        className,
    }: {
        item: MediaItem;
        aspect: "square" | "video" | "auto";
        className?: string;
    }) => {
        const [url, setUrl] = useState<string | null>(null);

        useEffect(() => {
            if (item.media.url.startsWith("attachment://")) {
                const file = files.find((file) => sanitizeFileName(file.name) === item.media.url.split("/").pop());
                if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setUrl(objectUrl);
                    return () => URL.revokeObjectURL(objectUrl); // cleanup
                }
            } else {
                setUrl(item.media.url);
            }
        }, [item.media.url]);

        if (!url) return null;

        return (
            <div
                className={`rounded-[4px] overflow-hidden ${aspect === "video" ? "aspect-video" : aspect === "square" ? "aspect-square" : ""} ${className ?? ""}`}
            >
                {/* biome-ignore lint/performance/noImgElement: image preview */}
                <img
                    src={url}
                    className={`${aspect === "auto" ? "w-full h-auto" : "size-full"} object-cover`}
                    alt={item.description ?? "image"}
                    width={256}
                    height={256}
                />
            </div>
        );
    };

    const count = items.length;

    if (count <= 0) return null;

    if (count === 1) {
        return (
            <div className="rounded-[8px] overflow-hidden max-w-[550px]">
                <Tile item={items[0]} aspect="auto" />
            </div>
        );
    }

    if (count === 2) {
        return (
            <div className="rounded-[8px] overflow-hidden grid grid-cols-2 gap-[4px] max-w-[550px]">
                {items.map((item, i) => (
                    <Tile key={`${item.media.url}-${i}`} item={item} aspect="square" />
                ))}
            </div>
        );
    }

    if (count === 3) {
        return (
            <div className="rounded-[8px] overflow-hidden grid grid-cols-3 grid-rows-2 gap-[4px] max-w-[550px]">
                <div className="col-span-2 row-span-2">
                    <Tile item={items[0]} aspect="square" />
                </div>
                <Tile key={`${items[1].media.url}-1`} item={items[1]} aspect="square" />
                <Tile key={`${items[2].media.url}-2`} item={items[2]} aspect="square" />
            </div>
        );
    }

    if (count === 4) {
        return (
            <div className="rounded-[8px] overflow-hidden grid grid-cols-2 gap-[4px] max-w-[550px]">
                {items.map((item, i) => (
                    <Tile key={`${item.media.url}-${i}`} item={item} aspect="video" />
                ))}
            </div>
        );
    }

    if (count === 5) {
        return (
            <div className="rounded-[8px] overflow-hidden flex flex-col gap-[4px] max-w-[550px]">
                <div className="grid grid-cols-2 gap-[4px]">
                    <Tile key={`${items[0].media.url}-0`} item={items[0]} aspect="square" />
                    <Tile key={`${items[1].media.url}-1`} item={items[1]} aspect="square" />
                </div>
                <div className="grid grid-cols-3 gap-[4px]">
                    <Tile key={`${items[2].media.url}-2`} item={items[2]} aspect="square" />
                    <Tile key={`${items[3].media.url}-3`} item={items[3]} aspect="square" />
                    <Tile key={`${items[4].media.url}-4`} item={items[4]} aspect="square" />
                </div>
            </div>
        );
    }

    if (count === 6) {
        return (
            <div className="rounded-[8px] overflow-hidden grid grid-cols-3 gap-[4px] max-w-[550px]">
                {items.map((item, i) => (
                    <Tile key={`${item.media.url}-${i}`} item={item} aspect="square" />
                ))}
            </div>
        );
    }

    if (count === 7) {
        return (
            <div className="rounded-[8px] overflow-hidden flex flex-col gap-[4px] max-w-[550px]">
                <Tile key={`${items[0].media.url}-0`} item={items[0]} aspect="video" />
                <div className="grid grid-cols-3 gap-[4px]">
                    {items.slice(1).map((item, i) => (
                        <Tile key={`${item.media.url}-${i + 1}`} item={item} aspect="square" />
                    ))}
                </div>
            </div>
        );
    }

    if (count === 8) {
        return (
            <div className="rounded-[8px] overflow-hidden flex flex-col gap-[4px] max-w-[550px]">
                <div className="grid grid-cols-2 gap-[4px]">
                    <Tile key={`${items[0].media.url}-0`} item={items[0]} aspect="square" />
                    <Tile key={`${items[1].media.url}-1`} item={items[1]} aspect="square" />
                </div>
                <div className="grid grid-cols-3 gap-[4px]">
                    {items.slice(2).map((item, i) => (
                        <Tile key={`${item.media.url}-${i + 2}`} item={item} aspect="square" />
                    ))}
                </div>
            </div>
        );
    }

    if (count === 9) {
        return (
            <div className="rounded-[8px] overflow-hidden grid grid-cols-3 gap-[4px] max-w-[550px]">
                {items.map((item, i) => (
                    <Tile key={`${item.media.url}-${i}`} item={item} aspect="square" />
                ))}
            </div>
        );
    }

    if (count === 10) {
        return (
            <div className="rounded-[8px] overflow-hidden flex flex-col gap-[4px] max-w-[550px]">
                <Tile key={`${items[0].media.url}-0`} item={items[0]} aspect="video" />
                <div className="grid grid-cols-3 gap-[4px]">
                    {items.slice(1).map((item, i) => (
                        <Tile key={`${item.media.url}-${i + 1}`} item={item} aspect="square" />
                    ))}
                </div>
            </div>
        );
    }

    // fallback: simple grid
    return (
        <div className="rounded-[8px] overflow-hidden grid grid-cols-3 gap-[4px] max-w-[550px]">
            {items.map((item, i) => (
                <Tile key={`${item.media.url}-${i}`} item={item} aspect="square" />
            ))}
        </div>
    );
}
