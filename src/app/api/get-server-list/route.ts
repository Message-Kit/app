import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_CLIENT_TOKEN!);

export async function POST(req: NextRequest) {
    const body = await req.json();
    const accessToken = body.accessToken as string;

    if (!accessToken) {
        return NextResponse.json({ message: "No access token!" }, { status: 401 });
    }

    try {
        const response = await rest.get(Routes.userGuilds(), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return NextResponse.json({ success: true, data: response });
    } catch {
        return NextResponse.json({ success: false });
    }
}
