"use client";

import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function Page() {
    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>
                        the main embed for #welcome
                    </CardDescription>
                    <CardAction>
                        <a href="/embeds/ef23x1e">
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="cursor-pointer"
                            >
                                <Edit />
                            </Button>
                        </a>
                    </CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    10 minutes ago
                </CardFooter>
            </Card>
        </div>
    );
}
