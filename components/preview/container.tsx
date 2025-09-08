import { type APIContainerComponent, ComponentType } from "discord-api-types/v10";
import PreviewButtonGroup from "./button-group";
import PreviewMediaGallery from "./media-gallery";
import PreviewSeparator from "./separator";
import PreviewTextDisplay from "./text-display";

export default function PreviewContainer({ component: comp }: { component: APIContainerComponent }) {
    return (
        <div className="flex flex-col gap-[8px] p-[16px] bg-[#393a41] border-[#44454c] border rounded-[8px] w-fit text-[14px]">
            {comp.components.map((component) => {
                if (component.type === ComponentType.TextDisplay) {
                    return <PreviewTextDisplay key={component.id} component={component} />;
                } else if (component.type === ComponentType.MediaGallery) {
                    return <PreviewMediaGallery component={component} />;
                } else if (component.type === ComponentType.Separator) {
                    return <PreviewSeparator key={component.id} component={component} />;
                } else if (component.type === ComponentType.ActionRow) {
                    return <PreviewButtonGroup key={component.id} component={component} />;
                }
                return null;
            })}
        </div>
    );
}
