import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import LabelInput from "./label-input";
import { nanoid } from "nanoid";

import { Select, SelectItem } from "./ui/select";
import { SelectTrigger } from "./ui/select";
import { SelectValue } from "./ui/select";
import { SelectContent } from "./ui/select";
import { useEffect, useState } from "react";
import { ActionType, ParamsType } from "@/types/params";
import { CircleDashed, Plus } from "lucide-react";
import LabelSelect from "./label-select";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { useUserStore } from "@/stores/user";
import supabase from "@/lib/supabase";
import { Separator } from "./ui/separator";
import { Template } from "@/types/template";
import { toast } from "sonner";
import NewActionParams from "./new-action-params";

export default function NewActionButton() {
    const { user } = useUserStore();

    // default question values
    const [actionName, setActionName] = useState("");
    const [selectedActionType, setSelectedActionType] =
        useState<ActionType | null>(null);

    // dependancy question values
    const [, setSelectedChannel] = useState<string | null>(null);
    const [, setSelectedTemplate] = useState<Template | null>(null);
    const [, setEphemeral] = useState<boolean>(true);

    const [actionTypes, setActionTypes] = useState<ActionType[] | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchActionTypes = async () => {
            const { data, error } = await supabase
                .from("action_types")
                .select("*");

            if (!error) setActionTypes(data);
        };

        fetchActionTypes();
    }, [user]);

    const [templates, setTemplates] = useState<Template[] | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchTemplates = async () => {
            const { data, error } = await supabase
                .from("templates")
                .select("*")
                .filter("guild_id", "eq", "1138777402684739587");

            if (!error) setTemplates(data);
        };

        fetchTemplates();
    }, [user]);

    const handleCreate = async () => {
        if (!user) return;
        if (!selectedActionType) return;

        const { error } = await supabase.from("actions").insert({
            updated_at: new Date().toISOString(),
            name: actionName,
            action_type: selectedActionType.id,
            custom_id: nanoid(10),
            guild_id: "1138777402684739587",
            params: params,
        });

        if (!error) {
            toast.success("Action created successfully");
            console.log(error);
        } else {
            toast.error("Failed to create action");
        }

        // reset form
        setActionName("");
        setSelectedActionType(null);
        setSelectedChannel(null);
        setSelectedTemplate(null);
        setEphemeral(true);
        setParams({});
    };

    const [params, setParams] = useState<Record<string, string | boolean>>({});

    useEffect(() => {
        console.log(params);
    }, [params]);

    // reset params when action type changes
    useEffect(() => {
        setParams({});
    }, [selectedActionType]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={!actionTypes}>
                    <Plus />
                    New Action
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Action</DialogTitle>
                    <DialogDescription>
                        Create a new action to be used to trigger actions.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    <LabelInput
                        label="Name"
                        id="name"
                        placeholder="Enter name"
                        required
                        value={actionName}
                        setValue={setActionName}
                    />
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <LabelSelect label="Type" id="type" required>
                                <Select
                                    onValueChange={(v) => {
                                        setSelectedActionType(
                                            actionTypes?.find(
                                                (actionType) =>
                                                    actionType.id === v
                                            ) || null
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {actionTypes?.map((actionType) => (
                                            <SelectItem
                                                key={actionType.id}
                                                value={actionType.id}
                                            >
                                                <CircleDashed />
                                                {actionType.name}
                                                <span className="text-muted-foreground">
                                                    +
                                                    {
                                                        Object.keys(
                                                            actionType.params
                                                        ).length
                                                    }
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </LabelSelect>
                        </div>
                        {selectedActionType && <Separator />}
                        <NewActionParams
                            selectedActionType={selectedActionType}
                            params={params}
                            setParams={setParams}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild onClick={handleCreate}>
                        <Button>Create</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
