import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Page() {
    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* <Card>
                <CardHeader>
                    <CardTitle>Templates</CardTitle>
                    <CardDescription>
                        yes
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                    Templates allow you to create reusable message
                    configurations that combine multiple elements like embeds,
                    interactive components, and actions. This makes it easy to
                    send consistent, feature-rich messages to Discord channels
                    with just a single template.
                </CardContent>
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle>Template Name</CardTitle>
                    <CardDescription>Created 10 minutes ago</CardDescription>
                    <CardAction>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button size="icon" variant={"ghost"}>
                                    <Ellipsis />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Rename</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardAction>
                </CardHeader>
                <CardFooter className="text-muted-foreground text-sm">
                    <Badge variant={"secondary"}>#welcome</Badge>
                </CardFooter>
            </Card>
        </div>
    );
}
