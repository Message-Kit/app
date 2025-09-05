import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function parseWebhook(urlString: string): { id: string; token: string } | null {
    try {
        const url = new URL(urlString);
        const parts = url.pathname.split("/").filter(Boolean);
        const idx = parts.indexOf("webhooks");
        const id = parts[idx + 1];
        const token = parts[idx + 2];
        if (!id || !token) return null;
        return { id, token };
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get("url") ?? searchParams.get("webhookUrl");

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        body = undefined;
    }

    const bodyObj = (typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {}) as {
        webhookUrl?: string;
        payload?: unknown;
        [key: string]: unknown;
    };

    const webhookUrl = (urlParam ?? (bodyObj.webhookUrl as string))?.toString();
    const payload = urlParam ? bodyObj : (bodyObj.payload ?? {});

    if (!webhookUrl) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const parsed = parseWebhook(webhookUrl);
    if (!parsed) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const rest = new REST({ version: "10" });

    try {
        await rest.post(Routes.webhook(parsed.id, parsed.token), {
            body: payload,
            query: new URLSearchParams({ wait: "true" }),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false }, { status: 502 });
    }
}
