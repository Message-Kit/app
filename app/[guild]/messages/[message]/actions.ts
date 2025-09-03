"use server";

import { REST } from "@discordjs/rest";
import {
    type APIGuildChannel,
    type GuildChannelType,
    MessageFlags,
    type RESTPostAPIChannelMessageJSONBody,
    Routes,
} from "discord-api-types/v10";

const clientToken = process.env.DISCORD_CLIENT_TOKEN;

if (!clientToken) {
    throw new Error("DISCORD_CLIENT_TOKEN is not set");
}

const rest = new REST({ version: "10" }).setToken(clientToken);

export async function sendMessageToDiscord(
    messageBody: RESTPostAPIChannelMessageJSONBody,
    channelId: string,
) {
    return await rest.post(Routes.channelMessages(channelId), {
        body: {
            components: messageBody.components,
            attachments: messageBody.attachments,
            flags: MessageFlags.IsComponentsV2,
        },
    });
}

export async function getChannelList(guildId: string) {
    return (await rest.get(Routes.guildChannels(guildId))) as APIGuildChannel<GuildChannelType>[];
}
