import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { access_token } = await req.json();

        const res = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Discord API error: ${res.status}`);
        }

        const guilds = await res.json();
        return NextResponse.json({ success: true, guilds });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}
