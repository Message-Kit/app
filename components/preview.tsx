import { ComponentType } from "discord-api-types/v10";
import { useOutputStore } from "@/lib/stores/output";
import PreviewButtonGroup from "./preview/button-group";
import PreviewContainer from "./preview/container";
import PreviewMediaGallery from "./preview/media-gallery";
import PreviewSeparator from "./preview/separator";
import PreviewTextDisplay from "./preview/text-display";

export default function Preview() {
    const { output } = useOutputStore();

    return (
        <div className="p-4 whitespace-pre-wrap bg-[#323339] font-discord flex h-full gap-[16px] overflow-y-auto">
            {/** biome-ignore lint/performance/noImgElement: e */}
            <img src="/logo.png" alt="avatar" className="size-[40px] rounded-full mt-[2px]" />
            <div className="flex flex-col w-full gap-[2px]">
                <div className="flex gap-[8px] items-end">
                    <div className="flex gap-[4px] items-center">
                        <span className="font-medium text-white">Message Kit</span>
                        <div className="bg-primary leading-4 text-[12.8px] font-semibold px-[4px] rounded-[4px]">
                            APP
                        </div>
                    </div>
                    <span className="text-[#949ba4] text-[12px] font-medium">12:30 AM</span>
                </div>
                <div className="flex flex-col gap-[8px] w-full">
                    {output.map((component) => {
                        if (component.type === ComponentType.TextDisplay) {
                            return <PreviewTextDisplay key={component.id} component={component} />;
                        } else if (component.type === ComponentType.Section) {
                            return <PreviewTextDisplay key={component.id} component={component} />;
                        } else if (component.type === ComponentType.MediaGallery) {
                            return <PreviewMediaGallery key={component.id} component={component} />;
                        } else if (component.type === ComponentType.Separator) {
                            return <PreviewSeparator key={component.id} component={component} />;
                        } else if (component.type === ComponentType.ActionRow) {
                            return <PreviewButtonGroup key={component.id} component={component} />;
                        } else if (component.type === ComponentType.Container) {
                            return <PreviewContainer key={component.id} component={component} />;
                        } else return null;
                    })}
                </div>
            </div>
        </div>
    );
}
