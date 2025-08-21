import { HTMLInputTypeAttribute } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function LabelInput({
    label,
    id,
    value,
    setValue,
    helperText,
    placeholder,
    type = "text",
}: {
    label: string;
    id: string;
    value?: string;
    setValue?: (value: string) => void;
    placeholder: string;
    helperText?: string;
    type?: HTMLInputTypeAttribute;
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                value={value}
                onChange={(e) => setValue?.(e.target.value)}
                placeholder={placeholder}
                type={type}
            />
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
