import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { motion } from "motion/react";
import { type PropsWithChildren, useEffect, useId, useState } from "react";
import { motionProps } from "@/lib/motion-props";
import { useHoveredComponentStore } from "@/lib/stores/hovered-component";
import { useShouldInspectStore } from "@/lib/stores/should-inspect";
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
    tag: number | null;
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
    tag,
}: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const { setHoveredComponent } = useHoveredComponentStore();
    const { shouldInspect } = useShouldInspectStore();

    useEffect(() => {
        if (name === "Media Gallery" || name === "Separator") {
            setCollapsed(true);
        }
    }, [name]);

    const id = useId();

    return (
        <motion.div {...motionProps}>
            {/** biome-ignore lint/a11y/noStaticElementInteractions: no */}
            <div
                className={cn(
                    "flex flex-col border rounded-xl bg-card",
                    className,
                    name !== "Container" && shouldInspect && "hover:ring-1 hover:ring-destructive",
                )}
                style={style}
                onMouseEnter={() => {
                    if (!shouldInspect) return;
                    setHoveredComponent(tag ?? null);
                }}
                onMouseLeave={() => {
                    if (!shouldInspect) return;
                    setHoveredComponent(null);
                }}
            >
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
                            <span className="text-xs text-muted-foreground mt-1 font-medium hidden md:block">
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
