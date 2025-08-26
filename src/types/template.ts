import { ButtonStyle } from "discord-api-types/v10";
import { APIMessage } from "discord-api-types/v10";

interface TypePlainContent {
    type: ItemType.PlainContent;
    content: string;
    accessory?: Accessory | null;
}

interface TypeMediaGallery {
    type: ItemType.MediaGallery;
    urls: string[];
}

interface TypeSeparator {
    type: ItemType.Separator;
    visible: boolean;
    size: "small" | "large";
}

type Item = TypePlainContent | TypeMediaGallery | TypeSeparator;

enum ItemType {
    PlainContent,
    MediaGallery,
    Separator,
    Container,
}

interface TypeContainer {
    type: ItemType.Container;
    color: string;
    items: Item[];
}

type FinalMessageItem = Item | TypeContainer;
type FinalMessage = FinalMessageItem[];

interface Template {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    body: FinalMessage;
    guild_id: string;
}

enum AccessoryType {
    Button,
    Image,
}

interface FinalButton {
    label: string;
    style: ButtonStyle;
    customId: string;
    url: string;
}

type Accessory =
    | { type: AccessoryType.Button; value: FinalButton }
    | { type: AccessoryType.Image; value: { url: string; alt: string } };

export type {
    FinalMessage,
    Template,
    TypeContainer,
    Item,
    TypePlainContent,
    TypeSeparator,
    TypeMediaGallery,
    FinalButton,
    Accessory,
};
export { ItemType, AccessoryType };
