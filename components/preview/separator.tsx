import { type APISeparatorComponent, SeparatorSpacingSize } from "discord-api-types/v10";
import { useHoveredComponentStore } from "@/lib/stores/hovered-component";
import { cn, inspectedStyle } from "@/lib/utils";

export default function PreviewSeparator({ component }: { component: APISeparatorComponent }) {
    const { hoveredComponent } = useHoveredComponentStore();

    return (
        <div
            className={cn(
                "h-[1px] bg-[#46474e]",
                component.spacing === SeparatorSpacingSize.Large ? "my-[8px]" : "my-[2px]",
                component.divider ? "bg-[#46474e]" : "bg-transparent",
                hoveredComponent === component.id && inspectedStyle,
            )}
        />
    );
}
