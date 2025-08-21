import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_CLIENT_TOKEN!
);

export async function POST(req: NextRequest) {
    const { guildId } = await req.json();

    if (!guildId) {
        return NextResponse.json(
            { message: "Missing guildId" },
            { status: 400 }
        );
    }

    try {
        const channels = await rest.get(Routes.guildChannels(guildId));
        console.log(channels);
        return NextResponse.json({ channels });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error fetching channels" },
            { status: 500 }
        );
    }
}
