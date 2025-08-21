import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";

export default function TemplateItem() {
    return (
        <div className="px-6 py-4 rounded-lg bg-card flex justify-between border">
            <div className="grid gap-2">
                <span className="font-medium">untitled template</span>
                {/* <span className="text-sm text-muted-foreground flex gap-1">
                    <Badge variant={"secondary"}>embed</Badge>
                    <Badge variant={"secondary"}>buttons</Badge>
                </span> */}
            </div>
            <Button variant="ghost" size="icon">
                <Ellipsis />
            </Button>
        </div>
    );
}
