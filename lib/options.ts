import {
    type APIContainerComponent,
    type APIMediaGalleryComponent,
    type APISeparatorComponent,
    type APITextDisplayComponent,
    ComponentType,
    SeparatorSpacingSize,
} from "discord-api-types/v10";
import { BoxIcon, ImageIcon, SeparatorHorizontalIcon, TextIcon } from "lucide-react";

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
        name: "Separator",
        type: ComponentType.Separator,
        icon: SeparatorHorizontalIcon,
        create: (): APISeparatorComponent => ({
            type: ComponentType.Separator,
            spacing: SeparatorSpacingSize.Small,
            divider: true,
        }),
    },
] as const;
