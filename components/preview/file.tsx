import type { APIFileComponent } from "discord-api-types/v10";
import FileIcon from "../misc/file-icon";

export default function PreviewFile({ component }: { component: APIFileComponent }) {
    return (
        <div className="bg-[#393a41] border border-[#44454c] rounded-[8px] p-[16px] w-[432px] flex items-center gap-[8px] shadow-md">
            <FileIcon />
            <div className="flex flex-col">
                <span className="text-[#7bb0f5] hover:underline cursor-pointer text-[16px] leading-none">
                    {component.file.url.length === 0 ? "Untitled" : component.file.url.split("/").pop()}
                </span>
                <span className="text-[#adaeb4] text-[12px]">69.25 KB</span>
            </div>
        </div>
    );
}
