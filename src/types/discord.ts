import { ChannelType } from "discord-api-types/v10";

export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
    position: number;
    parent_id: string | null;
}

export interface Guild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    owner: boolean;
    permissions: string;
    features: string[];
    position: number;
}