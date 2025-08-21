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
import { Ellipsis, Hammer, Hash, Plus } from "lucide-react";

export default function Page() {
    return (
        <div className="py-16 px-4">
            <div className="flex flex-col gap-2">
                <span className="text-4xl font-display font-bold">
                    Actions{" "}
                    <span className="text-muted-foreground text-3xl">
                        (1/99)
                    </span>
                </span>
                <span className="text-muted-foreground">
                    Define actions that can be used for buttons, dropdowns, and
                    forms.
                </span>
            </div>
            <div className="mt-4 md:mt-12 flex flex-col gap-2">
                <div className="flex gap-2">
                    <Input />
                    <Button>
                        <Plus />
                        New Action
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Ban user ahh</CardTitle>
                        <CardDescription>
                            Last updated 12 hours ago
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
                            ban-user
                        </Badge>
                        <Badge variant={"secondary"} className="font-mono">
                            <Hash />
                            7f3a2b9c
                        </Badge>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
