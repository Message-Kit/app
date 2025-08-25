import { ActionType } from "@/types/params";
import LabelInput from "./label-input";
import { useId } from "react";
import { getLabelAndPlaceholderAndHelperText } from "@/lib/more-utils";
import LabelSelect from "./label-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface MainProps {
    selectedActionType: ActionType | null;
    params: Record<string, string | boolean>;
    setParams: (params: Record<string, string | boolean>) => void;
}

function StringInput({
    keyQuestion,
    value,
    setValue,
}: {
    keyQuestion: string;
    value: string | undefined;
    setValue: (value: string) => void;
}) {
    const id = useId();
    const { label, placeholder, helperText } =
        getLabelAndPlaceholderAndHelperText(keyQuestion);

    return (
        <LabelInput
            label={label}
            id={id}
            placeholder={placeholder}
            value={value ?? ""}
            setValue={setValue}
            helperText={helperText}
            required
        />
    );
}

function BooleanInput({
    keyQuestion,
    value,
    setValue,
}: {
    keyQuestion: string;
    value: boolean | undefined;
    setValue: (value: boolean) => void;
}) {
    const id = useId();
    const { label, placeholder, helperText } =
        getLabelAndPlaceholderAndHelperText(keyQuestion);

    return (
        <LabelSelect label={label} helperText={helperText} id={id} required>
            <Select
                value={
                    typeof value === "boolean" ? String(value) : undefined
                }
                onValueChange={(v) => setValue(v === "true")}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                </SelectContent>
            </Select>
        </LabelSelect>
    );
}

export default function NewActionParams({
    selectedActionType,
    params,
    setParams,
}: MainProps) {
    if (!selectedActionType) return null;

    const allParams = Object.fromEntries(
        Object.entries(selectedActionType.params).map(([key, value]) => [
            key,
            value.type,
        ])
    );

    return (
        <>
            {Object.keys(selectedActionType.params).map(
                (keyQuestion, index) => {
                    const paramType = allParams[keyQuestion];

                    return paramType === "string" ? (
                        <StringInput
                            key={index}
                            keyQuestion={keyQuestion}
                            value={
                                typeof params[keyQuestion] === "string"
                                    ? (params[keyQuestion] as string)
                                    : undefined
                            }
                            setValue={(v) =>
                                setParams({
                                    ...params,
                                    [keyQuestion]: v,
                                })
                            }
                        />
                    ) : paramType === "boolean" ? (
                        <BooleanInput
                            key={index}
                            keyQuestion={keyQuestion}
                            value={
                                typeof params[keyQuestion] === "boolean"
                                    ? (params[keyQuestion] as boolean)
                                    : undefined
                            }
                            setValue={(v) =>
                                setParams({
                                    ...params,
                                    [keyQuestion]: v,
                                })
                            }
                        />
                    ) : null;
                }
            )}
        </>
    );
}
