import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const providerToken = body.providerToken as string;
    const botToken = process.env.DISCORD_CLIENT_TOKEN;

    if (!providerToken) {
        return NextResponse.json({ message: "No access token!" }, { status: 401 });
    }
    if (!botToken) {
        return NextResponse.json({ message: "Missing bot token" }, { status: 500 });
    }

    try {
        const [userGuildsRes, botGuildsRes] = await Promise.all([
            fetch("https://discord.com/api/v10/users/@me/guilds", {
                headers: {
                    Authorization: `Bearer ${providerToken}`,
                },
            }),
            fetch("https://discord.com/api/v10/users/@me/guilds", {
                headers: {
                    Authorization: `Bot ${botToken}`,
                },
            }),
        ]);

        if (!userGuildsRes.ok) {
            return NextResponse.json({ success: false }, { status: userGuildsRes.status });
        }
        if (!botGuildsRes.ok) {
            return NextResponse.json({ success: false }, { status: botGuildsRes.status });
        }

        const [userGuilds, botGuilds] = await Promise.all([
            userGuildsRes.json(),
            botGuildsRes.json(),
        ]);

        const botGuildIds = new Set((botGuilds as Array<{ id: string }>).map((g) => g.id));
        const intersection = (userGuilds as Array<{ id: string }>).filter((g) => botGuildIds.has(g.id));

        return NextResponse.json({ success: true, data: intersection });
    } catch {
        return NextResponse.json({ success: false });
    }
}
