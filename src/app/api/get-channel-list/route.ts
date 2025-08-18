import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";

const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN!
);

export async function POST(req: Request) {
    try {
        const { guildId } = await req.json();

        if (!guildId) {
            return NextResponse.json(
                { success: false, error: "Missing guildId" },
                { status: 400 }
            );
        }

        const channels = await rest.get(Routes.guildChannels(guildId));
        return NextResponse.json({ success: true, channels });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}
