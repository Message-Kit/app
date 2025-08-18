"use client";

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
import { useSessionStore } from "@/stores/session";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGuildStore } from "@/stores/guild";
import { Guild } from "@/stores/guild";

export function GuildCombobox() {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const { session } = useSessionStore();
    const { selectedGuild, setSelectedGuild } = useGuildStore();

    useEffect(() => {
        if (!session) return;

        const yes = async () => {
            const res = await fetch("/api/get-server-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access_token: session.provider_token }),
            });

            const data = await res.json();

            if (data.success) {
                setGuilds(
                    (data.guilds as Guild[]).filter((item) => item.owner === true)
                );
            } else {
                toast.error("Failed to fetch guilds!", {
                    description: data.error,
                });
            }
        };

        yes();
    }, [session]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (guilds.length > 0) {
            setSelectedGuild(guilds[0]);
        }
    }, [guilds]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <SidebarMenuButton
                    role="combobox"
                    aria-expanded={open}
                    size={"lg"}
                >
                    <Avatar className="size-8 rounded-lg overflow-hidden">
                        <AvatarImage src={"https://github.com/ronykax.png"} />
                        <AvatarFallback>{selectedGuild?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="truncate font-medium text-sm font-display">
                            {selectedGuild && selectedGuild.name}
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
                        <CommandEmpty>No guild found.</CommandEmpty>
                        <CommandGroup>
                            {guilds.map((item, index) => (
                                <CommandItem
                                    key={index}
                                    value={`${item.name}::${item.id}`}
                                    onSelect={(currentValue: string) => {
                                        const selectedId = currentValue.split("::").pop() || "";
                                        const guild = guilds.find((g) => g.id === selectedId) || null;
                                        if (guild) setSelectedGuild(guild);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedGuild?.id === item.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
