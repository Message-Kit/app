"use client";

import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import {
    ChevronDown,
    ChevronUp,
    Ellipsis,
    Eye,
    Plus,
    Trash,
} from "lucide-react";
import LabelInput from "../label-input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

export interface OutgoingDiscordEmbed {
    title: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;

    footer?: { text?: string; icon_url?: string; proxy_icon_url?: string };
    image?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    thumbnail?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    video?: { url?: string; height?: number; width?: number };
    provider?: { name?: string; url?: string };
    author?: {
        name?: string;
        url?: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    fields?: { name?: string; value?: string; inline?: boolean }[];
}

interface Props {
    embeds: OutgoingDiscordEmbed[];
    setEmbeds: (embeds: OutgoingDiscordEmbed[]) => void;
}

export default function Embed({ embeds, setEmbeds }: Props) {
    function editEmbed(index: number, embed: OutgoingDiscordEmbed) {
        const newEmbeds = [...embeds];
        newEmbeds[index] = embed;
        setEmbeds(newEmbeds);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Embeds{" "}
                    <span className="text-muted-foreground">
                        ({embeds.length}/24)
                    </span>
                </CardTitle>
                <CardDescription>
                    Embeds are rich message containers that let you display
                    styled content inside a message.
                </CardDescription>
                <CardAction>
                    <Button
                        variant={"outline"}
                        onClick={() => {
                            setEmbeds([...embeds, { title: "" }]);
                        }}
                    >
                        <Plus />
                        Add
                    </Button>
                </CardAction>
            </CardHeader>
            {embeds.map((embed, index) => (
                <div key={index}>
                    <Separator />
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <LabelInput
                                    label="Title"
                                    id={`title-${index}`}
                                    value={embed.title ?? ""}
                                    setValue={(value) =>
                                        editEmbed(index, {
                                            ...embed,
                                            title: value,
                                        })
                                    }
                                    placeholder="Enter your title"
                                    helperText={`${embed.title.length}/256`}
                                />
                                <LabelInput
                                    label="Title URL"
                                    id={`title-url-${index}`}
                                    placeholder="Enter your title url"
                                    value={embed.url ?? ""}
                                    setValue={(value) =>
                                        editEmbed(index, {
                                            ...embed,
                                            url: value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor={`description-${index}`}>
                                    Description
                                </Label>
                                <Textarea
                                    id={`description-${index}`}
                                    placeholder="Enter your description"
                                    className="h-24"
                                    value={embed.description ?? ""}
                                    onChange={(e) => {
                                        editEmbed(index, {
                                            ...embed,
                                            description: e.target.value,
                                        });
                                    }}
                                />
                                <p
                                    className="text-muted-foreground text-xs"
                                    role="region"
                                    aria-live="polite"
                                >
                                    {embed.description?.length ?? 0}
                                    /4096
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </div>
            ))}
        </Card>
    );
}

// "use client";

// import { useId, useState } from "react";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "../ui/button";
// import {
//     ChevronDown,
//     ChevronUp,
//     Ellipsis,
//     Eye,
//     Trash,
// } from "lucide-react";
// import LabelInput from "../label-input";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "../ui/dropdown-menu";

// function TextareaWithHelperText() {
//     const id = useId();
//     const [value, setValue] = useState("");

//     return (
//         <div className="flex flex-col gap-2">
//             <Label htmlFor={id}>Description</Label>
//             <Textarea
//                 id={id}
//                 placeholder="Enter your description"
//                 className="h-24"
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//             />
//             <p
//                 className="text-muted-foreground text-xs"
//                 role="region"
//                 aria-live="polite"
//             >
//                 {value.length}/4096
//             </p>
//         </div>
//     );
// }

// //

// export default function Embed() {
//     const [title, setTitle] = useState("");

//     return (
//         <div className="flex flex-col gap-8 w-full p-6 bg-card rounded-xl border">
//             <div className="flex flex-col gap-6 w-full">
//                 <div className="flex flex-col md:flex-row gap-4 w-full">
//                     <LabelInput
//                         label="Title"
//                         id="title"
//                         value={title}
//                         setValue={setTitle}
//                         placeholder="Enter your title"
//                         helperText={`${title.length}/256`}
//                     />
//                     <LabelInput
//                         label="Title URL"
//                         id="title-url"
//                         placeholder="Enter your title url"
//                     />
//                 </div>

//                 <TextareaWithHelperText />
//             </div>
//             <div className="flex gap-2 justify-end">
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button size={"icon"} variant={"ghost"}>
//                             <Ellipsis />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                         <DropdownMenuItem>
//                             <ChevronUp />
//                             Move Up
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                             <ChevronDown />
//                             Move down
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem className="text-destructive">
//                             <Trash className="text-destructive" />
//                             Delete
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//                 <Button variant={"outline"}>
//                     <Eye />
//                     Preview
//                 </Button>
//             </div>
//         </div>
//     );
// }
