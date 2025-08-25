import { PropsWithChildren } from "react";
import { Label } from "./ui/label";

interface Props extends PropsWithChildren {
    label: string;
    id: string;
    helperText?: string;
    required?: boolean;
}

export default function LabelSelect({
    label,
    id,
    children,
    helperText,
    required,
}: Props) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label htmlFor={id}>
                {label}
                {" "}
                {required && <span className="text-destructive">*</span>}
            </Label>
            {children}
            {helperText && (
                <p
                    className="text-muted-foreground text-xs"
                    role="region"
                    aria-live="polite"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}
