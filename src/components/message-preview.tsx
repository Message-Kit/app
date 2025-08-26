import { cn } from "@/lib/utils";
import { AccessoryType, FinalMessage, ItemType, TypeContainer, TypeMediaGallery, TypePlainContent, TypeSeparator } from "@/types";
import { ButtonStyle } from "discord-api-types/v10";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface Props {
    finalMessage: FinalMessage;
}

export default function MessagePreview({ finalMessage }: Props) {
    return (
        <div className="max-w-[598px] h-full p-6 bg-[#323339] rounded-xl border font-ass">
            <div className="flex flex-col gap-2">
                {finalMessage.map((item, index) => (
                    <div key={index}>
                        {item.type === ItemType.PlainContent ? (
                            <PreviewPlainContent item={item} />
                        ) : item.type === ItemType.Separator ? (
                            <PreviewSeparator item={item} />
                        ) : item.type === ItemType.MediaGallery ? (
                            <PreviewMediaGallery item={item} />
                        ) : item.type === ItemType.Container ? (
                            <PreviewContainer item={item} />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PreviewPlainContent({ item, fontSizeSmall }: { item: TypePlainContent; fontSizeSmall?: boolean }) {
    let text = item.content;
    text = text.replace(/^-# (.*)$/gm, "#### $1");

    return (
        <div className={cn("flex justify-between gap-4", fontSizeSmall ? "w-full" : "w-fit")}>
            <span className={cn("text-[#dbdee1]", fontSizeSmall && "text-sm")}>
                <ReactMarkdown
                    remarkPlugins={[remarkBreaks, remarkGfm]}
                    components={{
                        h1: ({ children }) => <h1 className={cn("font-bold", "text-2xl leading-normal")}>{children}</h1>,
                        h2: ({ children }) => <h2 className={cn("font-bold", "text-xl leading-normal")}>{children}</h2>,
                        h3: ({ children }) => <h3 className={cn("font-bold", "text-lg leading-normal")}>{children}</h3>,
                        h4: ({ children }) => <h4 className={cn("text-[#959ba3]", "text-[11.375px] leading-normal")}>{children}</h4>,
                        code: ({ children }) => (
                            <code className="bg-[#353748] text-[#dbdee1] px-1 py-0.5 rounded-[4px] border-[#4f505f] border leading-normal">
                                {children}
                            </code>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-[#4f505f] pl-4 text-[#dbdee1]/65 rounded-[4px] leading-normal">
                                {children}
                            </blockquote>
                        ),
                        ul: ({ children }) => <ul className="list-disc list-inside py-2 leading-normal">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside py-2 leading-normal">{children}</ol>,
                        li: ({ children }) => <li className="py-0.5 leading-normal">{children}</li>,
                    }}
                >
                    {text}
                </ReactMarkdown>
            </span>
            {item.accessory &&
                (item.accessory.type === AccessoryType.Button ? (
                    <div
                        role="button"
                        className="px-3 py-1.5 text-sm size-fit rounded-[10px] flex items-center whitespace-nowrap"
                        style={{
                            backgroundColor:
                                item.accessory.value.style === ButtonStyle.Primary
                                    ? "#5865f2"
                                    : item.accessory.value.style === ButtonStyle.Secondary || item.accessory.value.style === ButtonStyle.Link
                                    ? "#4f545c"
                                    : item.accessory.value.style === ButtonStyle.Success
                                    ? "#248046"
                                    : item.accessory.value.style === ButtonStyle.Danger
                                    ? "#dc2626"
                                    : "#5865f2",
                        }}
                    >
                        <span className="font-medium whitespace-nowrap">
                            {item.accessory.value.label}
                        </span>
                    </div>
                ) : (
                    <Image
                        src={item.accessory.value.url}
                        alt="accessory"
                        className="size-24 object-cover rounded-[8px]"
                        width={1080}
                        height={1080}
                    />
                ))}
        </div>
    );
}

function PreviewSeparator({ item }: { item: TypeSeparator }) {
    return (
        <div
            className="h-px"
            style={{
                backgroundColor: item.visible ? "#47474e" : undefined,
                margin: item.size === "large" ? "16px 0" : "8px 0",
            }}
        />
    );
}

function PreviewMediaGallery({ item }: { item: TypeMediaGallery }) {
    return (
        <div className="grid grid-cols-2 gap-1 rounded-[8px] overflow-hidden w-fit">
            {item.urls.map((item, idx) => (
                <Image
                    key={idx}
                    src={item}
                    alt={`media ${idx}`}
                    className="w-full h-auto object-cover rounded-[4px]"
                    width={1080}
                    height={1080}
                />
            ))}
        </div>
    );
}

function PreviewContainer({ item }: { item: TypeContainer }) {
    return (
        <div
            className="bg-[#393a41] border border-[#44454c] p-4 rounded-[8px] border-l-4 w-full"
            style={{
                borderLeftColor: item.color,
            }}
        >
            {item.items.map((item, index) => (
                <div key={index}>
                    {item.type === ItemType.PlainContent ? (
                        <PreviewPlainContent item={item} fontSizeSmall />
                    ) : item.type === ItemType.Separator ? (
                        <PreviewSeparator item={item} />
                    ) : item.type === ItemType.MediaGallery ? (
                        <PreviewMediaGallery item={item} />
                    ) : null}
                </div>
            ))}
        </div>
    );
}
