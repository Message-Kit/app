import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIContainerComponent,
    type APIFileComponent,
    type APIMediaGalleryComponent,
    type APISeparatorComponent,
    type APIStringSelectComponent,
    type APITextDisplayComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import {
    BoxIcon,
    FileIcon,
    ImageIcon,
    MousePointerClickIcon,
    SeparatorHorizontalIcon,
    SquareChevronDownIcon,
    TextIcon,
} from "lucide-react";
import { generateRandomNumber } from "./random-number";

export const componentDescriptors = [
    {
        name: "Text",
        type: ComponentType.TextDisplay,
        icon: TextIcon,
        create: (): APITextDisplayComponent => ({
            id: generateRandomNumber(),
            type: ComponentType.TextDisplay,
            content: "",
        }),
    },
    {
        name: "Media",
        type: ComponentType.MediaGallery,
        icon: ImageIcon,
        create: (): APIMediaGalleryComponent => ({
            id: generateRandomNumber(),
            type: ComponentType.MediaGallery,
            items: [],
        }),
    },
    {
        name: "File",
        type: ComponentType.File,
        icon: FileIcon,
        create: (): APIFileComponent => ({ id: generateRandomNumber(), type: ComponentType.File, file: { url: "" } }),
    },
    {
        name: "Separator",
        type: ComponentType.Separator,
        icon: SeparatorHorizontalIcon,
        create: (): APISeparatorComponent => ({
            id: generateRandomNumber(),
            type: ComponentType.Separator,
            spacing: SeparatorSpacingSize.Small,
            divider: true,
        }),
    },
    {
        name: "Container",
        type: ComponentType.Container,
        icon: BoxIcon,
        create: (): APIContainerComponent => ({
            id: generateRandomNumber(),
            type: ComponentType.Container,
            components: [],
        }),
    },
    {
        name: "Buttons",
        type: ComponentType.ActionRow,
        icon: MousePointerClickIcon,
        create: (): APIActionRowComponent<APIButtonComponent> => ({
            id: generateRandomNumber(),
            type: ComponentType.ActionRow,
            components: [],
        }),
    },
    {
        name: "Select",
        type: ComponentType.ActionRow,
        icon: SquareChevronDownIcon,
        create: (): APIActionRowComponent<APIStringSelectComponent> => ({
            id: generateRandomNumber(),
            type: ComponentType.ActionRow,
            components: [],
        }),
    },
] as const;
