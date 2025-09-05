import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIContainerComponent,
    type APIFileComponent,
    type APIMediaGalleryComponent,
    type APISeparatorComponent,
    type APITextDisplayComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { BoxIcon, FileIcon, ImageIcon, MousePointerClickIcon, SeparatorHorizontalIcon, TextIcon } from "lucide-react";

export const componentDescriptors = [
    {
        name: "Container",
        type: ComponentType.Container,
        icon: BoxIcon,
        create: (): APIContainerComponent => ({ type: ComponentType.Container, components: [] }),
    },
    {
        name: "Text Display",
        type: ComponentType.TextDisplay,
        icon: TextIcon,
        create: (): APITextDisplayComponent => ({ type: ComponentType.TextDisplay, content: "" }),
    },
    {
        name: "Media Gallery",
        type: ComponentType.MediaGallery,
        icon: ImageIcon,
        create: (): APIMediaGalleryComponent => ({ type: ComponentType.MediaGallery, items: [] }),
    },
    {
        name: "File",
        type: ComponentType.File,
        icon: FileIcon,
        create: (): APIFileComponent => ({ type: ComponentType.File, file: { url: "" } }),
    },
    {
        name: "Separator",
        type: ComponentType.Separator,
        icon: SeparatorHorizontalIcon,
        create: (): APISeparatorComponent => ({
            type: ComponentType.Separator,
            spacing: SeparatorSpacingSize.Small,
            divider: true,
        }),
    },
    {
        name: "Button Group",
        type: ComponentType.ActionRow,
        icon: MousePointerClickIcon,
        create: (): APIActionRowComponent<APIButtonComponent> => ({ type: ComponentType.ActionRow, components: [] }),
    },
    // {
    //     name: "Select Menu",
    //     type: ComponentType.StringSelect,
    //     icon: SquareChevronDownIcon,
    //     create: (): APIActionRowComponent<APIStringSelectComponent> => ({
    //         type: ComponentType.ActionRow,
    //         components: [],
    //     }),
    // },
] as const;
