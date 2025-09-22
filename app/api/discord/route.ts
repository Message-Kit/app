import { Client } from "@buape/carbon";
import { createHandler } from "@buape/carbon/adapters/fetch";

const client = new Client(
    {
        baseUrl: process.env.BASE_URL!,
        deploySecret: process.env.DEPLOY_SECRET!,
        clientId: process.env.DISCORD_CLIENT_ID!,
        publicKey: process.env.DISCORD_PUBLIC_KEY!,
        token: process.env.DISCORD_CLIENT_TOKEN!,
    },
    {}
);

const handler = createHandler(client);
export { handler as GET, handler as POST };
