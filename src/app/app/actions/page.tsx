"use client";

import LabelInput from "@/components/label-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CircleDashed, Ellipsis, Hammer, Hash, Plus } from "lucide-react";

export default function Page() {
    return (
        <div className="py-16 px-4">
            <div className="flex flex-col gap-2">
                <span className="text-4xl font-display font-bold">
                    Actions{" "}
                    <span className="text-muted-foreground text-3xl">
                        (1/99)
                    </span>
                </span>
                <span className="text-muted-foreground">
                    Define actions that can be used for buttons, dropdowns, and
                    forms.
                </span>
            </div>
            <div className="mt-4 md:mt-12 flex flex-col gap-2">
                <div className="flex gap-2">
                    <Input />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                New Action
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Action</DialogTitle>
                                <DialogDescription>
                                    Create a new action to be used to trigger
                                    actions.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-6">
                                <LabelInput
                                    label="Name"
                                    id="name"
                                    placeholder="Enter name"
                                />
                                <div className="flex flex-col gap-2">
                                    <Label>Type</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="reply-to-message">
                                                <CircleDashed />
                                                Reply to message
                                                <span className="text-muted-foreground">
                                                    +1
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="send-message">
                                                <CircleDashed />
                                                Send message
                                                <span className="text-muted-foreground">
                                                    +1
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant={"outline"}>Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button>Create</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Ban user ahh</CardTitle>
                        <CardDescription>
                            Last updated 12 hours ago
                        </CardDescription>
                        <CardAction>
                            <Button variant={"ghost"} size={"icon"}>
                                <Ellipsis />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex gap-2">
                        <Badge variant={"default"} className="font-mono">
                            <Hammer />
                            ban-user
                        </Badge>
                        <Badge variant={"secondary"} className="font-mono">
                            <Hash />
                            7f3a2b9c
                        </Badge>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
