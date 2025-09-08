import type { APITextDisplayComponent } from "discord-api-types/v10";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PreviewTextDisplay({ component }: { component: APITextDisplayComponent }) {
    return (
        <div className="leading-normal text-[#dbdee1]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{component.content}</ReactMarkdown>
        </div>
    );
}
