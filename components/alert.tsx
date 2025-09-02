import { CircleAlertIcon } from "lucide-react";

interface AlertProps {
    title: string;
    description: string | string[];
}

export default function Alert({ title, description }: AlertProps) {
    return (
        <div className="rounded-md border bg-card px-4 py-3 text-destructive">
            <div className="flex gap-3">
                <CircleAlertIcon className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                <div className="grow space-y-1">
                    <p className="text-sm font-medium">{title}</p>
                    {Array.isArray(description) ? (
                        <ul className="list-inside list-disc text-sm">
                            {description.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
