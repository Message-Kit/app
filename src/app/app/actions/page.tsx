"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import { useUserStore } from "@/stores/user";
import { Action } from "@/types/params";
import { Ellipsis, Hammer, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import NewActionButton from "@/components/new-action-button";

export default function Page() {
    const { user } = useUserStore();
    const [actions, setActions] = useState<Action[] | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchActions = async () => {
            const { data, error } = await supabase
                .from("actions")
                .select("*")
                .filter("guild_id", "eq", "1138777402684739587");

            if (!error) setActions(data);
        };

        fetchActions();
    }, [user]);

    return (
        <div className="py-16 px-4">
            <div className="flex flex-col gap-2">
                <span className="text-4xl font-display font-bold">
                    Actions{" "}
                    <span className="text-muted-foreground text-3xl">
                        ({actions?.length || 0}/99)
                    </span>
                </span>
                <span className="text-muted-foreground">
                    Define actions that can be used for buttons, dropdowns, and
                    forms.
                </span>
            </div>
            <div className="mt-4 md:mt-12 flex flex-col gap-2">
                <div className="flex gap-2 mb-2">
                    <Input placeholder="Search actions" />
                    <NewActionButton />
                </div>
                {actions?.map((action) => (
                    <Card key={action.id}>
                        <CardHeader>
                            <CardTitle>{action.name}</CardTitle>
                            <CardDescription>
                                Last updated{" "}
                                {new Date(
                                    action.updated_at
                                ).toLocaleDateString()}
                            </CardDescription>
                            <CardAction>
                                <Button variant={"ghost"} size={"icon"}>
                                    <Ellipsis />
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex gap-2">
                            <Badge variant={"default"} className="font-mono">
                                <Hammer />
                                {action.action_type}
                            </Badge>
                            <Badge variant={"secondary"} className="font-mono">
                                <Hash />
                                {action.custom_id}
                            </Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
