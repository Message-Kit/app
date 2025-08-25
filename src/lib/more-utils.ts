export function getLabelAndPlaceholderAndHelperText(keyQuestion: string) {
    let label = keyQuestion;
    let placeholder = `Enter ${keyQuestion}`;
    let helperText = "";

    switch (keyQuestion) {
        case "template_id":
            label = "Template ID";
            placeholder = "Enter template ID";
            helperText = "The ID of the template to use";
            break;
        case "ephemeral":
            label = "Ephemeral";
            placeholder = "Enter ephemeral";
            helperText = "Whether the message should be ephemeral";
            break;
        case "channel_id":
            label = "Channel ID";
            placeholder = "Enter channel ID";
            helperText = "The ID of the channel to send the template to";
            break;
    }

    return { label, placeholder, helperText };
}
