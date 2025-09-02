import { SeparatorSpacingSize } from "discord-api-types/v10";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator as UISeparator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function Separator({
    onMoveUp,
    onMoveDown,
    onDelete,
    spacing,
    divider,
    onChangeSpacing,
    onChangeDivider,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    spacing: SeparatorSpacingSize;
    divider: boolean;
    onChangeSpacing: (size: SeparatorSpacingSize) => void;
    onChangeDivider: (value: boolean) => void;
}) {
    return (
        <div className="flex flex-col border rounded-xl bg-card">
            <div className="px-2 py-2 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronDownIcon />
                    </Button>
                    <div className="flex gap-4 items-center">
                        <span className="font-semibold text-sm text-accent-foreground">Separator</span>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold px-2">
                        Show Divider Line?
                        <Switch checked={divider} onCheckedChange={onChangeDivider} />
                    </div>
                    <Button variant={"ghost"} size={"icon"} className="size-7" onClick={onMoveUp}>
                        <ChevronUpIcon />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="size-7" onClick={onMoveDown}>
                        <ChevronDownIcon />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="size-7" onClick={onDelete}>
                        <TrashIcon />
                    </Button>
                </div>
            </div>
            <UISeparator />
            <div className="p-4">
                <Tabs
                    value={spacing === SeparatorSpacingSize.Large ? "large" : "small"}
                    onValueChange={(value) => {
                        if (value === "large") {
                            onChangeSpacing(SeparatorSpacingSize.Large);
                        } else {
                            onChangeSpacing(SeparatorSpacingSize.Small);
                        }
                    }}
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="large">Large</TabsTrigger>
                        <TabsTrigger value="small">Small</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}

// EXAMPLE OF HOW IT'S DEFINED IN THE COMPONENTS BODY:

// import { ComponentType } from "discord-api-types/v10";

// const _message: APIMessageTopLevelComponent = {
//     type: ComponentType.Separator,
//     divider: true, // whether to show the divider line
//     spacing: SeparatorSpacingSize.Large, // the spacing size
// };
