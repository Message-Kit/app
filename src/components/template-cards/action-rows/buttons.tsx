import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Circle, Ellipsis, ExternalLink, Plus } from "lucide-react";
import LabelInput from "@/components/label-input";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ButtonType = "primary" | "secondary" | "link" | "danger";

type ConfiguredButton = {
    label: string;
    type: ButtonType;
    link?: string;
    action?: string;
};

const typeToVariant: Record<
    ButtonType,
    "default" | "secondary" | "link" | "destructive"
> = {
    primary: "default",
    secondary: "secondary",
    link: "secondary",
    danger: "destructive",
};

export default function Buttons() {
    const [open, setOpen] = React.useState(false);
    const [buttons, setButtons] = React.useState<ConfiguredButton[]>([]);

    const [label, setLabel] = React.useState("");
    const [type, setType] = React.useState<ButtonType | undefined>(undefined);
    const [link, setLink] = React.useState("");
    const [action, setAction] = React.useState<string | undefined>(undefined);

    const resetForm = () => {
        setLabel("");
        setType(undefined);
        setLink("");
        setAction(undefined);
    };

    const isValid = React.useMemo(() => {
        if (!label.trim() || !type) return false;
        if (type === "link") return Boolean(link.trim());
        return Boolean(action);
    }, [label, type, link, action]);

    const handleConfirm = () => {
        if (!isValid || !type) return;
        const newButton: ConfiguredButton = {
            label: label.trim(),
            type,
            link: type === "link" ? link.trim() : undefined,
            action: type !== "link" ? action : undefined,
        };
        setButtons((prev) => [...prev, newButton]);
        setOpen(false);
        resetForm();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Buttons{" "}
                    <span className="text-muted-foreground">
                        ({buttons.length}/24)
                    </span>
                </CardTitle>
                <CardDescription>
                    Add buttons and make them trigger actions. Click on a button
                    to edit it.
                </CardDescription>
                <CardAction>
                    <div className="flex flex-col-reverse items-end md:flex-row gap-2">
                        <Button variant={"ghost"} size={"icon"}>
                            <Ellipsis />
                        </Button>
                        <Dialog
                            open={open}
                            onOpenChange={(v) => {
                                setOpen(v);
                                if (!v) resetForm();
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button variant={"outline"}>
                                    <Plus className="w-4 h-4" />
                                    Add
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Button</DialogTitle>
                                    <DialogDescription>
                                        Configure the button to be added to the
                                        action row.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6">
                                    <LabelInput
                                        label="Label"
                                        id="btn-label"
                                        value={label}
                                        setValue={setLabel}
                                        helperText={`${label.length}/256`}
                                        placeholder="Enter your label"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <Label>Type</Label>
                                        <Select
                                            value={type}
                                            onValueChange={(v: ButtonType) => {
                                                setType(v);
                                                setLink("");
                                                setAction(undefined);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="primary">
                                                    <Circle fill="#5765f2" />
                                                    Primary
                                                </SelectItem>
                                                <SelectItem value="secondary">
                                                    <Circle fill="#242428" />
                                                    Secondary
                                                </SelectItem>
                                                <SelectItem value="danger">
                                                    <Circle fill="#d22d39" />
                                                    Danger
                                                </SelectItem>
                                                <SelectItem value="link">
                                                    <Circle fill="#29292d" />
                                                    Link
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {type === "link" ? (
                                        // <div className="flex flex-col gap-2">
                                        //     <Label htmlFor="btn-link">Link</Label>
                                        //     <Input
                                        //         id="btn-link"
                                        //         value={link}
                                        //         onChange={(e) => setLink(e.target.value)}
                                        //         placeholder="https://example.com"
                                        //     />
                                        // </div>
                                        <LabelInput
                                            label="Link"
                                            id="btn-link"
                                            value={link}
                                            setValue={setLink}
                                            placeholder="https://example.com"
                                        />
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <Label>Action</Label>
                                            <Select
                                                value={action}
                                                onValueChange={(v) =>
                                                    setAction(v)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="action-1">
                                                        Action 1
                                                    </SelectItem>
                                                    <SelectItem value="action-2">
                                                        Action 2
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={handleConfirm}
                                        disabled={!isValid}
                                    >
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardAction>
            </CardHeader>
            {buttons.length !== 0 && (
                <>
                    <Separator />
                    <CardContent className="w-full flex flex-wrap-reverse gap-2">
                        {buttons.map((button, i) => (
                            <Button
                                key={i}
                                variant={typeToVariant[button.type]}
                            >
                                {button.label}
                                {button.type === "link" && button.link ? (
                                    <ExternalLink />
                                ) : null}
                            </Button>
                        ))}
                    </CardContent>
                </>
            )}
        </Card>
    );
}

// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogClose,
//     DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Circle, ExternalLink, Plus } from "lucide-react";
// import LabelInput from "@/components/label-input";

// type ButtonType = "primary" | "secondary" | "link" | "danger";

// type ConfiguredButton = {
//     label: string;
//     type: ButtonType;
//     link?: string;
//     action?: string;
// };

// const typeToVariant: Record<
//     ButtonType,
//     "default" | "secondary" | "link" | "destructive"
// > = {
//     primary: "default",
//     secondary: "secondary",
//     link: "secondary",
//     danger: "destructive",
// };

// export default function Buttons() {
//     const [open, setOpen] = React.useState(false);
//     const [buttons, setButtons] = React.useState<ConfiguredButton[]>([]);

//     const [label, setLabel] = React.useState("");
//     const [type, setType] = React.useState<ButtonType | undefined>(undefined);
//     const [link, setLink] = React.useState("");
//     const [action, setAction] = React.useState<string | undefined>(undefined);

//     const resetForm = () => {
//         setLabel("");
//         setType(undefined);
//         setLink("");
//         setAction(undefined);
//     };

//     const isValid = React.useMemo(() => {
//         if (!label.trim() || !type) return false;
//         if (type === "link") return Boolean(link.trim());
//         return Boolean(action);
//     }, [label, type, link, action]);

//     const handleConfirm = () => {
//         if (!isValid || !type) return;
//         const newButton: ConfiguredButton = {
//             label: label.trim(),
//             type,
//             link: type === "link" ? link.trim() : undefined,
//             action: type !== "link" ? action : undefined,
//         };
//         setButtons((prev) => [...prev, newButton]);
//         setOpen(false);
//         resetForm();
//     };

//     return (
//         <div className="bg-card rounded-xl border p-6 w-full flex flex-wrap items-center gap-2">
//             {buttons.map((button, i) => (
//                 <Button key={i} variant={typeToVariant[button.type]}>
//                     {button.label}
//                     {button.type === "link" && button.link ? (
//                         <ExternalLink />
//                     ) : null}
//                 </Button>
//             ))}
//             <Dialog
//                 open={open}
//                 onOpenChange={(v) => {
//                     setOpen(v);
//                     if (!v) resetForm();
//                 }}
//             >
//                 <DialogTrigger asChild>
//                     <Button variant={"outline"}>
//                         <Plus className="w-4 h-4" />
//                         Add Button
//                     </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Configure Button</DialogTitle>
//                         <DialogDescription>
//                             Configure the button to be added to the action row.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-6">
//                         <LabelInput
//                             label="Label"
//                             id="btn-label"
//                             value={label}
//                             setValue={setLabel}
//                             helperText={`${label.length}/256`}
//                             placeholder="Enter your label"
//                         />
//                         <div className="flex flex-col gap-2">
//                             <Label>Type</Label>
//                             <Select
//                                 value={type}
//                                 onValueChange={(v: ButtonType) => {
//                                     setType(v);
//                                     setLink("");
//                                     setAction(undefined);
//                                 }}
//                             >
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="primary">
//                                         <Circle fill="#5765f2" />
//                                         Primary
//                                     </SelectItem>
//                                     <SelectItem value="secondary">
//                                         <Circle fill="#242428" />
//                                         Secondary
//                                     </SelectItem>
//                                     <SelectItem value="danger">
//                                         <Circle fill="#d22d39" />
//                                         Danger
//                                     </SelectItem>
//                                     <SelectItem value="link">
//                                         <Circle fill="#29292d" />
//                                         Link
//                                     </SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         {type === "link" ? (
//                             // <div className="flex flex-col gap-2">
//                             //     <Label htmlFor="btn-link">Link</Label>
//                             //     <Input
//                             //         id="btn-link"
//                             //         value={link}
//                             //         onChange={(e) => setLink(e.target.value)}
//                             //         placeholder="https://example.com"
//                             //     />
//                             // </div>
//                             <LabelInput
//                                 label="Link"
//                                 id="btn-link"
//                                 value={link}
//                                 setValue={setLink}
//                                 placeholder="https://example.com"
//                             />
//                         ) : (
//                             <div className="flex flex-col gap-2">
//                                 <Label>Action</Label>
//                                 <Select
//                                     value={action}
//                                     onValueChange={(v) => setAction(v)}
//                                 >
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Select action" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="action-1">
//                                             Action 1
//                                         </SelectItem>
//                                         <SelectItem value="action-2">
//                                             Action 2
//                                         </SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         )}
//                     </div>
//                     <DialogFooter>
//                         <DialogClose asChild>
//                             <Button variant="outline">Cancel</Button>
//                         </DialogClose>
//                         <Button onClick={handleConfirm} disabled={!isValid}>
//                             Confirm
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }
