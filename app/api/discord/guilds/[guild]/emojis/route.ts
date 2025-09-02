import { REST } from "@discordjs/rest";
import { type APIEmoji, Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ guild: string }> }) {
    const { guild } = await params;
    const clientToken = process.env.DISCORD_CLIENT_TOKEN;
    if (!clientToken) {
        return NextResponse.json({ error: "DISCORD_CLIENT_TOKEN is not set" }, { status: 500 });
    }

    const rest = new REST({ version: "10" }).setToken(clientToken);

    try {
        const emojis = (await rest.get(Routes.guildEmojis(guild))) as APIEmoji[];
        return NextResponse.json(emojis);
    } catch (error) {
        const message = (error as Error)?.message ?? "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
