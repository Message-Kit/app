import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { motion } from "motion/react";
import { type PropsWithChildren, useEffect, useId, useState } from "react";
import { motionProps } from "@/lib/motion-props";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface Props extends PropsWithChildren {
    name: string;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    extraButton?: React.ReactNode;
    helperText?: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function NewBuilder({
    name,
    onMoveUp,
    onMoveDown,
    onRemove,
    extraButton,
    helperText,
    children,
    className,
    style,
}: Props) {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (name === "Media Gallery" || name === "Separator") {
            setCollapsed(true);
        }
    }, [name]);

    const id = useId();

    return (
        <motion.div {...motionProps}>
            <div className={cn("flex flex-col border rounded-xl bg-card", className)} style={style}>
                <div className="flex justify-between items-center gap-2 p-2">
                    <div className="flex items-center gap-2">
                        <Button
                            id={`collapse-button-${id}`}
                            variant={"ghost"}
                            size={"icon"}
                            className="size-7"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                        </Button>
                        <Label className="font-semibold text-sm" htmlFor={`collapse-button-${id}`}>
                            {name}
                        </Label>
                        {helperText && (
                            <span className="text-sm text-muted-foreground font-medium tracking-wide hidden md:block">
                                {helperText}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5">
                        {extraButton}
                        <Button className="size-7" variant="ghost" onClick={onMoveUp}>
                            <ChevronUpIcon />
                        </Button>
                        <Button className="size-7" variant="ghost" onClick={onMoveDown}>
                            <ChevronDownIcon />
                        </Button>
                        <Button className="size-7" variant="ghost" onClick={onRemove}>
                            <TrashIcon />
                        </Button>
                    </div>
                </div>
                {!collapsed && (
                    <>
                        <Separator />
                        <div className="p-4">{children}</div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
