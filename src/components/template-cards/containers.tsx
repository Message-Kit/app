import { Ellipsis, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

export default function Containers() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Container</CardTitle>
                <CardDescription>Containers are so awesome</CardDescription>
                <CardAction className="flex gap-2">
                    <Button variant={"ghost"} size={"icon"}>
                        <Ellipsis />
                    </Button>
                    <Button variant={"outline"}>
                        <Plus />
                        Add
                    </Button>
                </CardAction>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="rounded-lg border border-border p-4">

                </div>
            </CardContent>
        </Card>
    );
}
