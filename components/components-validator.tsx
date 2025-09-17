import { type APIMessageComponent, ComponentType } from "discord-api-types/v10";
import { TriangleAlertIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { useOutputStore } from "@/lib/stores/output";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function getComponentName(type: ComponentType) {
    switch (type) {
        case ComponentType.TextDisplay:
            return "Text";
        case ComponentType.Section:
            return "Text";
        case ComponentType.Container:
            return "Container";
        case ComponentType.MediaGallery:
            return "Media";
        case ComponentType.ActionRow:
            return "Buttons"
        default:
            return "Component";
    }
}

const validateComponents = (components: APIMessageComponent[]): string[] => {
    const errors: string[] = [];

    components.forEach((component, noobIndex) => {
        const index = noobIndex + 1;

        if (component.type === ComponentType.TextDisplay && component.content.trim() === "") {
            errors.push(`${getComponentName(component.type)} component [${index}] is missing text.`);
        } else if (component.type === ComponentType.Section && component.components[0].content.trim() === "") {
            errors.push(`${getComponentName(component.type)} component [${index}] is missing text.`);
        } else if (component.type === ComponentType.Container && component.components.length <= 0) {
            errors.push(`${getComponentName(component.type)} [${index}] must at least one component.`);
        } else if (component.type === ComponentType.MediaGallery && component.items.length <= 0) {
            errors.push(`${getComponentName(component.type)} component [${index}] must have at least one image.`);
        } else if (component.type === ComponentType.ActionRow && component.components.length <= 0) {
            errors.push(`${getComponentName(component.type)} component [${index}] must have at least one button.`)
        }
    });

    return errors;
};

export default function ComponentsValidator() {
    const { output } = useOutputStore();

    const errors = useMemo(() => validateComponents(output), [output]);

    if (errors.length === 0) {
        return null;
    }

    return (
        <Alert key="alert" variant="destructive" className="rounded-xl">
            <TriangleAlertIcon />
            <AlertTitle>Fix errors before sending</AlertTitle>
            <AlertDescription>
                <ul className="list-disc list-inside">
                    {errors.map((error, _index) => {
                        const parts = error.split(/(\[.*?\])/g);

                        return (
                            <li key={nanoid(10)}>
                                {parts.map((part) => {
                                    if (part.startsWith("[") && part.endsWith("]")) {
                                        return (
                                            <span key={part} className="font-mono">
                                                {part}
                                            </span>
                                        );
                                    }
                                    return <span key={part}>{part}</span>;
                                })}
                            </li>
                        );
                    })}
                </ul>
            </AlertDescription>
        </Alert>
    );
}
