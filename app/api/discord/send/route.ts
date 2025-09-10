import type { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { type NextRequest, NextResponse } from "next/server";

const botToken = process.env.DISCORD_CLIENT_TOKEN;

if (!botToken) {
    throw new Error("DISCORD_CLIENT_TOKEN is not set");
}

const webhookUrl =
    "https://discord.com/api/webhooks/1413482921423274065/Kds1jalCKsOIHHzP9hJg5ckbhnC4O-Bk45-O6QRVYlQLLu2OBruGVMI0BRhu97VIWXO3";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const messagePayload = formData.get("message") as string;

    const message = JSON.parse(messagePayload) as RESTPostAPIChannelMessageJSONBody;

    const forwardForm = new FormData();

    // Attach message as payload_json
    forwardForm.append("payload_json", JSON.stringify(message));

    // Attach files
    files.forEach((file, i) => {
        forwardForm.append(`files[${i}]`, file, file.name);
    });

    const url = new URL(webhookUrl);
    url.searchParams.set("with_components", "true");

    const res = await fetch(url.toString(), {
        method: "POST",
        body: forwardForm, // <-- send multipart
    });

    if (!res.ok) {
        const text = await res.text();
        console.log("error:", text);
        throw new Error(`Webhook send failed: ${res.status} ${text}`);
    }

    return NextResponse.json({ success: true });
}
