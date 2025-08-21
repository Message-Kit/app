"use client";

import { Input } from "../ui/input";
import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import {
    ChevronDown,
    ChevronUp,
    Copy,
    Ellipsis,
    Eye,
    MoveUp,
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

function TextareaWithHelperText() {
    const id = useId();
    const [value, setValue] = useState("");

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>Description</Label>
            <Textarea
                id={id}
                placeholder="Enter your description"
                className="h-24"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <p
                className="text-muted-foreground text-xs"
                role="region"
                aria-live="polite"
            >
                {value.length}/4096
            </p>
        </div>
    );
}

//

export default function Embed() {
    const [title, setTitle] = useState("");

    return (
        <div className="flex flex-col gap-8 w-full p-6 bg-card rounded-xl border">
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <LabelInput
                        label="Title"
                        id="title"
                        value={title}
                        setValue={setTitle}
                        placeholder="Enter your title"
                        helperText={`${title.length}/256`}
                    />
                    <LabelInput
                        label="Title URL"
                        id="title-url"
                        placeholder="Enter your title url"
                    />
                </div>

                <TextareaWithHelperText />
            </div>
            <div className="flex gap-2 justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"ghost"}>
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <ChevronUp />
                            Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ChevronDown />
                            Move down
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <Trash className="text-destructive" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant={"outline"}>
                    <Eye />
                    Preview
                </Button>
            </div>
        </div>
    );
}
