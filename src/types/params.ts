// // action params
// export type ReplyToMessage = {
//     ephemeral?: boolean;
//     template_id: string;
// };

// export type SendMessage = {
//     channel_id: string;
//     use_webhook: boolean;
//     template_id: string;
// };

// shared fields
interface BaseAction {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    guild_id: string;
    custom_id: string;
}

// discriminated union
export type Action =
    | (BaseAction & {
          action_type: "reply-to-message";
          params: ParamsType;
      })
    | (BaseAction & {
          action_type: "send-message";
          params: ParamsType;
      });

export type ParamsType = Record<
    string,
    {
        type: "string" | "boolean" | "number";
        required: boolean;
    }
>;

export interface ActionType {
    id: string;
    name: string;
    params: ParamsType;
}
