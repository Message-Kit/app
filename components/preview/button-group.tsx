import {
    type APIActionRowComponent,
    type APIComponentInMessageActionRow,
    ButtonStyle,
    ComponentType,
} from "discord-api-types/v10";
import { cn } from "@/lib/utils";
import ExternalLinkIcon from "../misc/external-link-icon";

export default function PreviewButtonGroup({
    component,
}: {
    component: APIActionRowComponent<APIComponentInMessageActionRow>;
}) {
    return (
        <div className="flex gap-[8px]">
            {component.components
                .filter((child) => child.type === ComponentType.Button && child.style !== ButtonStyle.Premium)
                .map((child) => {
                    return (
                        <a
                            key={`${child.type}-${child.id}`}
                            href={child.style === ButtonStyle.Link ? child.url : "/actions/undefined"}
                            className={cn(
                                "flex px-[11px] h-[32px] rounded-[8px] duration-150 cursor-pointer",

                                // button background colors
                                child.style === ButtonStyle.Primary
                                    ? "bg-primary hover:bg-[#4654c0]"
                                    : child.style === ButtonStyle.Secondary
                                      ? "bg-[#3e3f45] hover:bg-[#46474e]"
                                      : child.style === ButtonStyle.Success
                                        ? "bg-[#00863a] hover:bg-[#047e37]"
                                        : child.style === ButtonStyle.Danger
                                          ? "bg-[#d22d39] hover:bg-[#b42831]"
                                          : child.style === ButtonStyle.Link
                                            ? "bg-[#3e3f45] hover:bg-[#46474e]"
                                            : "",
                            )}
                        >
                            <span className="min-w-[32px] my-auto text-center text-[14px] font-medium leading-[18px]">
                                {child.label}
                            </span>
                            {child.style === ButtonStyle.Link && (
                                <span className="ml-[8px] my-auto">
                                    <ExternalLinkIcon />
                                </span>
                            )}
                        </a>
                    );
                })}
        </div>
    );
}
