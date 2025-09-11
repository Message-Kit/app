import {
    type APIActionRowComponent,
    type APIComponentInMessageActionRow,
    ButtonStyle,
    ComponentType,
} from "discord-api-types/v10";
import PreviewButton from "./button";
import { cn } from "@/lib/utils";
import { useHoveredComponentStore } from "@/lib/stores/hovered-component";

export default function PreviewButtonGroup({
    component,
}: {
    component: APIActionRowComponent<APIComponentInMessageActionRow>;
}) {
    const { hoveredComponent } = useHoveredComponentStore();
    
    return (
        <div className={cn("flex gap-[8px]", hoveredComponent === component.id && "ring-1 ring-destructive animate-pulse [animation-duration:0.75s]")}>
            {component.components
                .filter((child) => child.type === ComponentType.Button && child.style !== ButtonStyle.Premium)
                .map((child) => {
                    return <PreviewButton button={child} key={`${child.type}-${child.id}`} />;
                })}
        </div>
    );
}
