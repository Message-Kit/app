import type { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";

export interface Template {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    body: RESTPostAPIChannelMessageJSONBody;
    guild_id: string;
}
