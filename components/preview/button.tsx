import {
    type APIButtonComponentWithCustomId,
    type APIButtonComponentWithURL,
    ButtonStyle,
} from "discord-api-types/v10";
import { cn } from "@/lib/utils";
import ExternalLinkIcon from "../misc/external-link-icon";

export default function PreviewButton({
    button,
}: {
    button: APIButtonComponentWithCustomId | APIButtonComponentWithURL;
}) {
    const style =
        button.style === ButtonStyle.Primary
            ? "bg-primary hover:bg-[#4654c0]"
            : button.style === ButtonStyle.Secondary
              ? "bg-[#3e3f45] hover:bg-[#46474e]"
              : button.style === ButtonStyle.Success
                ? "bg-[#00863a] hover:bg-[#047e37]"
                : button.style === ButtonStyle.Danger
                  ? "bg-[#d22d39] hover:bg-[#b42831]"
                  : button.style === ButtonStyle.Link
                    ? "bg-[#3e3f45] hover:bg-[#46474e]"
                    : "";

    const className = cn("flex px-[11px] h-[32px] rounded-[8px] duration-150 cursor-pointer", style);

    function Label() {
        return (
            <span className="min-w-[32px] my-auto text-center text-[14px] font-medium leading-[18px]">
                {button.label}
            </span>
        );
    }

    return button.style === ButtonStyle.Link ? (
        <a href={button.url} className={className} target="_blank" rel="noreferrer">
            <Label />
            <span className="ml-[8px] my-auto">
                <ExternalLinkIcon />
            </span>
        </a>
    ) : (
        <button type="button" className={className}>
            <Label />
        </button>
    );
}
