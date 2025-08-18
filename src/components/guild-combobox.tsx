"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SidebarMenuButton } from "./ui/sidebar";

export function GuildCombobox() {
    const servers = [
        { guildId: "1234567890", label: "Rony's Server" },
        { guildId: "2345678901", label: "Pixel Palace" },
        { guildId: "3456789012", label: "Code Cafe" },
        { guildId: "4567890123", label: "Chill Zone" },
        { guildId: "5678901234", label: "Tech Hub" },
    ];

    const guilds = servers.map((server) => ({
        guildId: server.guildId,
        label: server.label,
        value: server.label.toLowerCase().replace(/ /g, "-"),
    }));

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("pixel-palace");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <SidebarMenuButton
                    role="combobox"
                    aria-expanded={open}
                    size={"lg"}
                >
                    <Avatar className="size-8 rounded-lg overflow-hidden">
                        <AvatarImage src="https://github.com/ronykax.png" />
                        <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="truncate font-medium text-sm font-display">
                            {value
                                ? guilds.find(
                                      (framework) => framework.value === value
                                  )?.label
                                : "Select framework..."}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            29 Members
                        </span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent className="w-[270px] md:w-[238px] p-0">
                <Command>
                    <CommandInput placeholder="Search guild..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {guilds.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue: string) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
