import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { motion } from "motion/react";
import { type PropsWithChildren, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface Props extends PropsWithChildren {
    name: string;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
    extraButton?: React.ReactNode;
}

export default function NewBuilder({ name, onMoveUp, onMoveDown, onRemove, extraButton, children }: Props) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.1 }}
        >
            <div className="flex flex-col border rounded-xl bg-card">
                <div className="flex justify-between items-center gap-2 p-2">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-7"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                        </Button>
                        <span className="font-semibold text-sm">{name}</span>
                    </div>
                    <div className="flex items-center gap-1">
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
