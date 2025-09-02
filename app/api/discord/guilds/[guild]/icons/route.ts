import { REST } from "@discordjs/rest";
import { type APIGuild, CDNRoutes, ImageFormat, RouteBases, Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: { guild: string } }) {
    const clientToken = process.env.DISCORD_CLIENT_TOKEN;
    if (!clientToken) {
        return NextResponse.json({ error: "DISCORD_CLIENT_TOKEN is not set" }, { status: 500 });
    }

    const rest = new REST({ version: "10" }).setToken(clientToken);

    try {
        const guild = (await rest.get(Routes.guild(context.params.guild))) as APIGuild;
        if (!guild.icon) {
            return NextResponse.json({ error: "Guild has no icon" }, { status: 404 });
        }

        const format = guild.icon.startsWith("a_") ? ImageFormat.GIF : ImageFormat.WebP;
        const url = RouteBases.cdn + CDNRoutes.guildIcon(guild.id, guild.icon, format);
        return NextResponse.json({ url });
    } catch (error) {
        const message = (error as Error)?.message ?? "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
