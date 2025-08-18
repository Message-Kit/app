import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        await rest.post(Routes.channelMessages(body.channelId), {
            body: body.body,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err },
            { status: 500 }
        );
    }
}
