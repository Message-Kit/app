import { type APIContainerComponent, ComponentType } from "discord-api-types/v10";
import { numberToHex } from "@/lib/utils";
import PreviewButtonGroup from "./button-group";
import PreviewFile from "./file";
import PreviewMediaGallery from "./media-gallery";
import PreviewSeparator from "./separator";
import PreviewTextDisplay from "./text-display";

export default function PreviewContainer({ component: comp }: { component: APIContainerComponent }) {
    return (
        <div className="flex border-[#44454c] border rounded-[8px] w-fit overflow-hidden">
            {comp.accent_color && (
                <div className="min-w-[4px] max-w-[4px]" style={{ backgroundColor: numberToHex(comp.accent_color) }} />
            )}
            <div className="flex flex-col gap-[8px] p-[16px] bg-[#393a41] text-[14px]">
                {comp.components.map((component) => {
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
                    } else if (component.type === ComponentType.File) {
                        return <PreviewFile key={component.id} component={component} />;
                    } else return null;
                })}
            </div>
        </div>
    );
}
