import {
    type APIActionRowComponent,
    type APIComponentInMessageActionRow,
    ButtonStyle,
    ComponentType,
} from "discord-api-types/v10";
import { useHoveredComponentStore } from "@/lib/stores/hovered-component";
import { cn, inspectedStyle } from "@/lib/utils";
import PreviewButton from "./button";

export default function PreviewButtonGroup({
    component,
}: {
    component: APIActionRowComponent<APIComponentInMessageActionRow>;
}) {
    const { hoveredComponent } = useHoveredComponentStore();

    return (
        <div className={cn("flex gap-[8px]", hoveredComponent === component.id && inspectedStyle)}>
            {component.components
                .filter((child) => child.type === ComponentType.Button && child.style !== ButtonStyle.Premium)
                .map((child) => {
                    return <PreviewButton button={child} key={`${child.type}-${child.id}`} />;
                })}
        </div>
    );
}
