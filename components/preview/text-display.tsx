import {
    type APISectionComponent,
    type APITextDisplayComponent,
    ButtonStyle,
    ComponentType,
} from "discord-api-types/v10";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import { Children, cloneElement, Fragment, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateRandomNumber } from "@/lib/random-number";
import { cn } from "@/lib/utils";
import ExternalLinkIcon from "../misc/external-link-icon";

function Mention({ icon, text }: { icon?: ReactNode; text: string }) {
    return (
        <span className="bg-[#3b3f65] px-[2px] rounded-[3px] text-[#ced7ff] font-medium hover:bg-[#5865f2] hover:text-white duration-150 cursor-pointer">
            {icon && icon}
            {text}
        </span>
    );
}

function renderNodesWithMentions(node: ReactNode): ReactNode {
    if (typeof node === "string") {
        const parts = node.split(/(<@&\d+>|<@\d+>|<#\d+>|@everyone|@here)/g);

        return parts.map((part, i) => {
            const userMatch = part.match(/^<@(\d+)>$/);
            if (userMatch) return <Mention key={`m-u-${i}-${userMatch[1]}`} text={"@User"} />;

            const channelMatch = part.match(/^<#(\d+)>$/);
            if (channelMatch)
                return (
                    <Mention
                        key={`m-c-${i}-${channelMatch[1]}`}
                        icon={
                            <svg
                                className="inline-block size-[16px] mb-[3.2px] mr-[4px]"
                                aria-label="Channel"
                                aria-hidden="false"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        }
                        text={"channel"}
                    />
                );

            const roleMatch = part.match(/^<@&(\d+)>$/);
            if (roleMatch) return <Mention key={`m-r-${i}-${roleMatch[1]}`} text={"@Role"} />;

            if (part === "@everyone") return <Mention key={generateRandomNumber()} text="@everyone" />;
            if (part === "@here") return <Mention key={generateRandomNumber()} text="@here" />;

            return part;
        });
    }

    if (Array.isArray(node)) {
        return Children.map(node, (child) => <Fragment>{renderNodesWithMentions(child as ReactNode)}</Fragment>);
    }

    if (isValidElement(node)) {
        const element = node as ReactElement<PropsWithChildren>;
        const childNodes = element.props.children;
        return cloneElement(element, undefined, renderNodesWithMentions(childNodes));
    }

    return node;
}

export default function PreviewTextDisplay({
    component,
    container,
}: {
    component: APITextDisplayComponent | APISectionComponent;
    container?: boolean;
}) {
    return (
        <div className="flex gap-[12px]">
            <div className="text-[#dbdee1] leading-[0]" style={{ fontSize: container ? "14px" : "16px" }}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ children }) => (
                            <p
                                className="leading-[1.375rem]"
                                style={{ lineHeight: container ? "1.203125rem" : "1.375rem" }}
                            >
                                {renderNodesWithMentions(children)}
                            </p>
                        ),
                        h1: ({ children }) => (
                            <h1 className="text-[24px] font-bold my-[8px] leading-[1.375em]">
                                {renderNodesWithMentions(children)}
                            </h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-[20px] font-bold my-[8px] leading-[1.375em]">
                                {renderNodesWithMentions(children)}
                            </h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-[16px] font-bold my-[8px] leading-[1.375em]">
                                {renderNodesWithMentions(children)}
                            </h3>
                        ),
                        ul: ({ children }) => (
                            <ul className="m-[4px_0_0_16px] list-outside list-disc">
                                {renderNodesWithMentions(children)}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ul className="m-[4px_0_0_16px] list-outside list-decimal">
                                {renderNodesWithMentions(children)}
                            </ul>
                        ),
                        li: ({ children }) => (
                            <li className="mb-[4px]" style={{ lineHeight: container ? "1.203125rem" : "1.375rem" }}>
                                {renderNodesWithMentions(children)}
                            </li>
                        ),
                        h6: ({ children }) => (
                            <span className="leading-[1.11719rem] text-[#9b9ca2] text-[13px]">{children}</span>
                        ),
                    }}
                >
                    {component.type === ComponentType.TextDisplay
                        ? component.content.replaceAll("-#", "######")
                        : component.components[0].content.replaceAll("-#", "######")}
                </ReactMarkdown>
            </div>
            {component.type === ComponentType.Section &&
                (component.accessory.type === ComponentType.Thumbnail ? (
                    <div className="rounded-[8px] overflow-hidden size-[86px]">
                        {/** biome-ignore lint/performance/noImgElement: balls */}
                        <img src={component.accessory.media.url} alt={component.accessory.description ?? "image"} />
                    </div>
                ) : component.accessory.type === ComponentType.Button ? (
                    component.accessory.style !== ButtonStyle.Premium && (
                        <div
                            className={cn(
                                "flex px-[11px] h-[32px] rounded-[8px] duration-150 cursor-pointer",

                                // button background colors
                                component.accessory.style === ButtonStyle.Primary
                                    ? "bg-primary hover:bg-[#4654c0]"
                                    : component.accessory.style === ButtonStyle.Secondary
                                      ? "bg-[#3e3f45] hover:bg-[#46474e]"
                                      : component.accessory.style === ButtonStyle.Success
                                        ? "bg-[#00863a] hover:bg-[#047e37]"
                                        : component.accessory.style === ButtonStyle.Danger
                                          ? "bg-[#d22d39] hover:bg-[#b42831]"
                                          : component.accessory.style === ButtonStyle.Link
                                            ? "bg-[#3e3f45] hover:bg-[#46474e]"
                                            : "",
                            )}
                        >
                            <span className="min-w-[32px] my-auto text-center text-[14px] font-medium leading-[18px]">
                                {component.accessory.label}
                            </span>
                            {component.accessory.style === ButtonStyle.Link && (
                                <span className="ml-[2px] my-auto">
                                    <ExternalLinkIcon />
                                </span>
                            )}
                        </div>
                    )
                ) : null)}
        </div>
    );
}
