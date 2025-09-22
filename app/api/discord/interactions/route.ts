import { Client, type Context } from "@buape/carbon";
import { createHandler } from "@buape/carbon/adapters/fetch";
import type { NextRequest } from "next/server";

const client = new Client(
    {
        baseUrl: process.env.BASE_URL!,
        deploySecret: process.env.DEPLOY_SECRET!,
        clientId: process.env.DISCORD_CLIENT_ID!,
        publicKey: process.env.DISCORD_PUBLIC_KEY!,
        token: process.env.DISCORD_CLIENT_TOKEN!,
    },
    {},
);

const carbonHandler = createHandler(client);

const ctx: Context = {};

export async function GET(req: NextRequest) {
    return carbonHandler(req, ctx);
}

export async function POST(req: NextRequest) {
    return carbonHandler(req, ctx);
}
