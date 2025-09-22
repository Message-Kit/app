import { BotActions } from "./actions";

export function getActionName(action: BotActions): string {
    switch (action) {
        case BotActions.DoNothing:
            return "Do Nothing";
        case BotActions.ReplyToInteraction:
            return "Reply To Interaction";
        case BotActions.SendToChannel:
            return "Send To Channel";
        default:
            return "Unknown Type";
    }
}
