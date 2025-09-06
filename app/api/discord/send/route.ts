import { NextRequest, NextResponse } from "next/server";
import { RESTPostAPIChannelMessageJSONBody, Routes } from "discord-api-types/v10";

type UploadFile = {
    name: string;
    mimeType: string;
    dataBase64: string;
};

export async function POST(req: NextRequest) {
    try {
        const {
            messageBody,
            options,
            files,
        }: {
            messageBody: RESTPostAPIChannelMessageJSONBody;
            options: { type: "bot"; channelId: string } | { type: "webhook"; webhookUrl: string };
            files?: UploadFile[];
        } = await req.json();

        if (!messageBody || !options) {
            return NextResponse.json({ error: "messageBody and options are required" }, { status: 400 });
        }

        const hasFiles = files && files.length > 0;

        const makeForm = () => {
            const form = new FormData();
            form.append("payload_json", JSON.stringify(messageBody));
            (files ?? []).forEach((file, i) => {
                const buffer = Buffer.from(file.dataBase64, "base64");
                form.append(`files[${i}]`, new Blob([buffer], { type: file.mimeType }), file.name);
            });
            return form;
        };

        if (options.type === "bot") {
            const url = `https://discord.com/api/v10${Routes.channelMessages(options.channelId)}`;
            const res = await fetch(url, {
                method: "POST",
                headers: hasFiles
                    ? { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN!}` }
                    : {
                          "Content-Type": "application/json",
                          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN!}`,
                      },
                body: hasFiles ? makeForm() : JSON.stringify(messageBody),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Bot send failed: ${res.status} ${text}`);
            }

            return NextResponse.json({ success: true });
        }

        if (options.type === "webhook") {
            const url = new URL(options.webhookUrl);
            url.searchParams.set("with_components", "true");

            const res = await fetch(url.toString(), {
                method: "POST",
                headers: hasFiles ? undefined : { "Content-Type": "application/json" },
                body: hasFiles ? makeForm() : JSON.stringify(messageBody),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Webhook send failed: ${res.status} ${text}`);
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid options type" }, { status: 400 });
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
    }
}
