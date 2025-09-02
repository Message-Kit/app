import type { APIMessageTopLevelComponent } from "discord-api-types/v10";
import { MarkdownRenderer } from "./markdown-renderer";

export default function MessagePreview({ components }: { components: APIMessageTopLevelComponent[] }) {
    components;
    return (
        <div className="font-discord bg-[#323339] p-8">
            <MarkdownRenderer content="hi <@123456> <@123457>" />
        </div>
    );
}
