"use client";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useId, useState } from "react";

export default function PlainMessage() {
    const id = useId();
    const [message, setMessage] = useState("");
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>Message</Label>
            <Textarea
                id={id}
                placeholder="Enter your message"
                className="h-24"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <p
                className="text-muted-foreground text-xs"
                role="region"
                aria-live="polite"
            >
                {message.length}/4096
            </p>
        </div>
    );
}

// import { Textarea } from "../ui/textarea";

// export default function PlainMessage() {
//     return (
//         <div className="w-full bg-card p-4 rounded-xl border">
//             <Textarea placeholder="Enter your message" className="h-24" />
//         </div>
//     );
// }
