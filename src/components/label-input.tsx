import { HTMLInputTypeAttribute } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LucideIcon } from "lucide-react";

export default function LabelInput({
    label,
    id,
    value,
    setValue,
    helperText,
    placeholder,
    type = "text",
    Icon,
    required = false,
}: {
    label: string;
    id: string;
    value?: string;
    setValue?: (value: string) => void;
    placeholder: string;
    helperText?: string;
    type?: HTMLInputTypeAttribute;
    Icon?: LucideIcon;
    required?: boolean;
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label htmlFor={id}>
                {label}
                {" "}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    value={value}
                    onChange={(e) => setValue?.(e.target.value)}
                    placeholder={placeholder}
                    type={type}
                    className="peer pe-9"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    {Icon && <Icon size={16} aria-hidden="true" />}
                </div>
            </div>

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
