import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_CLIENT_TOKEN!);

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body);

    try {
        await rest.post(Routes.channelMessages(body.channelId), {
            body: body.body,
        });

        return NextResponse.json({ message: "Sent!" });
    } catch (error) {
        console.error("error::::", error);
        return NextResponse.json({ message: "Error sending template!" });
    }
}
