import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import type { APIEmoji, APIMessageComponentEmoji, APIMessageTopLevelComponent } from "discord-api-types/v10";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function append<T>(array: readonly T[], item: T): T[] {
    return [...array, item];
}

export function removeAt<T>(array: readonly T[], index: number): T[] {
    const result = array.slice();
    result.splice(index, 1);
    return result;
}

export function updateAt<T>(array: readonly T[], index: number, updater: (oldValue: T) => T): T[] {
    const result = array.slice();
    result[index] = updater(result[index]);
    return result;
}

export function moveItem<T>(array: readonly T[], index: number, direction: "up" | "down"): T[] {
    const result = array.slice();
    if (direction === "up" && index > 0) {
        [result[index - 1], result[index]] = [result[index], result[index - 1]];
    }
    if (direction === "down" && index < result.length - 1) {
        [result[index + 1], result[index]] = [result[index], result[index + 1]];
    }
    return result;
}

export function hexToNumber(hex: string): number {
    if (hex.startsWith("#")) hex = hex.slice(1);
    return parseInt(hex, 16);
}

export function numberToHex(num: number): string {
    return `#${num.toString(16).padStart(6, "0")}`;
}

export const sanitizeFileName = (name: string) => name.trim().replace(/\s+/g, "_");

export type SendOptions =
    | {
          via: "bot";
          channel_id: string;
      }
    | {
          via: "webhook";
          webhook_url: string;
      };

export function parseDiscordWebhook(urlOrPath: string): { id: string; token: string } | null {
    // try as full URL first
    try {
        const url = new URL(urlOrPath);
        const match = url.pathname.match(/\/api\/webhooks\/(\d+)\/([^/?]+)/);
        if (match) return { id: match[1], token: decodeURIComponent(match[2]) };
    } catch {
        // not a full URL — fall through to path-only parsing
    }

    // path-only or raw "id/token"
    const fallbackMatch = urlOrPath
        .trim()
        .replace(/^\/+|\/+$/g, "")
        .match(/^(?:api\/webhooks\/)?(\d+)\/([^/?]+)/);
    if (fallbackMatch) return { id: fallbackMatch[1], token: decodeURIComponent(fallbackMatch[2]) };

    return null;
}

export const inspectedStyle = "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]";

export function toComponentEmoji(emoji: APIEmoji | string | null): APIMessageComponentEmoji | undefined {
    if (!emoji) return undefined;

    if (typeof emoji === "string") {
        // unicode emoji
        return { name: emoji };
    }

    // guild emoji
    return {
        id: emoji.id ?? undefined,
        name: emoji.name ?? undefined,
        animated: emoji.animated ?? false,
    };
}

export const defaultComponents: APIMessageTopLevelComponent[] = [
    {
        id: 500528667,
        type: 10,
        content:
            "# Create modular, interactive messages\nBuild interactive messages with a simple editor, live preview, and flexible sending options so you can focus on what you're saying, not how to format it.",
    },
    {
        id: 869213619,
        type: 17,
        components: [
            {
                id: 843217988,
                type: 12,
                items: [
                    {
                        media: {
                            url: "https://messagekit.app/example-header.png",
                        },
                        description: "header image",
                    },
                ],
            },
            {
                id: 280096184,
                type: 10,
                content:
                    "# Getting started\n- Install Message Kit in your server.\n- Click **Add Component** at the top of this pane and choose one.\n- Customize the component as you like.\n- Send it! You can send your message via our bot or with webhooks.",
            },
        ],
        accent_color: 5727743,
    },
    {
        id: 724873915,
        type: 1,
        components: [
            {
                id: 277957816,
                type: 2,
                label: "Support Server",
                style: 5,
                url: "https://discord.gg/5bBM2TVDD3",
            },
            {
                id: 172033159,
                type: 2,
                label: "Donate",
                style: 5,
                url: "https://ko-fi.com/ronykax",
            },
        ],
    },
];
