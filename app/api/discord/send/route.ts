import { REST } from "@discordjs/rest";
import { type RESTPostAPIChannelMessageJSONBody, Routes } from "discord-api-types/v10";
import { type NextRequest, NextResponse } from "next/server";
import { parseDiscordWebhook, type SendOptions } from "@/lib/utils";

const botToken = process.env.DISCORD_CLIENT_TOKEN;

if (!botToken) {
    throw new Error("DISCORD_CLIENT_TOKEN is not set");
}

const rest = new REST({ version: "10" }).setToken(botToken);

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const files = formData.getAll("images") as File[];
    const messagePayload = formData.get("message") as string;
    const optionsPayload = formData.get("options") as string;

    const message = JSON.parse(messagePayload) as RESTPostAPIChannelMessageJSONBody;
    const options = JSON.parse(optionsPayload) as SendOptions;

    const forwardForm = new FormData();

    // Attach message as payload_json
    forwardForm.append("payload_json", JSON.stringify(message));

    // Attach files
    files.forEach((file, i) => {
        forwardForm.append(`files[${i}]`, file, file.name);
    });

    if (options.via === "webhook") {
        const webhook = parseDiscordWebhook(options.webhook_url);
        if (!webhook) return NextResponse.json({ success: false });

        try {
            await rest.post(Routes.webhook(webhook.id, webhook.token), {
                body: JSON.parse(forwardForm.get("payload_json") as string), // <-- send multipart
                query: new URLSearchParams({ with_components: "true" }),
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.log("error:", error);
            return NextResponse.json({ success: false });
        }
    } else if (options.via === "bot") {
        try {
            await rest.post(Routes.channelMessages(options.channel_id), {
                body: JSON.parse(forwardForm.get("payload_json") as string), // <-- send multipart
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.log("error:", error);
            return NextResponse.json({ success: false });
        }
    }

    return NextResponse.json({ success: false });
}
