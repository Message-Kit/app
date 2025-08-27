import { Component, Palette, RefreshCw, Sliders, Wand2, Zap } from "lucide-react";
import { Check, X } from "lucide-react";
import React from "react";

type Feature = {
    icon: React.ReactNode;
    label: string;
    description: string;
    msgkit: true | false | "partial";
    discohook: true | false | "partial";
    tooltip?: { content: React.ReactNode };
};

const features: Feature[] = [
    {
        icon: <Wand2 className="text-gray-500" />,
        label: "Ease of Use",
        description: "Simple and beginner-friendly interface.",
        msgkit: true,
        discohook: false,
    },
    {
        icon: <Component className="text-gray-500" />,
        label: "Components v2",
        description: "Supports the latest Discord components.",
        msgkit: true,
        discohook: "partial",
    },
    {
        icon: <Zap className="text-gray-500" />,
        label: "Real-Time Sending",
        description: "Send messages directly to channels.",
        msgkit: true,
        discohook: false,
    },
    {
        icon: <Palette className="text-gray-500" />,
        label: "Modern Design",
        description: "Fresh, clean, and intuitive layout.",
        msgkit: true,
        discohook: false,
    },
    {
        icon: <RefreshCw className="text-gray-500" />,
        label: "Workflow",
        description: "Quick and efficient message building.",
        msgkit: true,
        discohook: "partial",
    },
];

const Compare = () => {
    return (
        <section className="py-32">
            <div className="container">
                <h2 className="mb-4 text-center text-4xl font-semibold font-display">Message Kit is Better</h2>
                <p className="text-muted-foreground mb-8 text-center">
                    A modern message builder for Discord that is better than the competition.
                </p>
                <div className="border border-border bg-background mx-auto max-w-4xl divide-y overflow-x-auto rounded-lg shadow">
                    <div className="bg-muted text-foreground hidden rounded-t-lg text-left text-base font-semibold sm:flex">
                        <div className="w-16 px-6 py-4"></div>
                        <div className="flex-1 px-6 py-4">Feature</div>
                        <div className="w-40 px-6 py-4">Message Kit</div>
                        <div className="w-40 px-6 py-4">Discohook</div>
                    </div>
                    {features.map((row) => (
                        <div key={row.label} className="flex flex-col items-start text-left sm:flex-row sm:items-center">
                            <div className="flex w-full items-center justify-start px-6 pt-4 sm:w-16 sm:justify-center sm:py-4">
                                {row.icon}
                                <span className="ml-3 text-base font-medium sm:hidden">{row.label}</span>
                            </div>
                            <div className="w-full flex-1 px-6 pb-2 sm:py-4">
                                <div className="hidden font-medium sm:block">{row.label}</div>
                                <div className="text-muted-foreground mb-2 mt-2 text-sm sm:mb-0">{row.description}</div>
                            </div>
                            <div className="flex w-full items-center justify-start px-6 pb-2 sm:w-40 sm:justify-center sm:py-4">
                                {row.msgkit === true ? (
                                    <Check className="size-5 text-green-600" />
                                ) : row.msgkit === "partial" ? (
                                    <Check className="size-5 text-yellow-500" />
                                ) : (
                                    <X className="text-destructive size-5" />
                                )}
                                <span className="text-muted-foreground ml-2 text-xs font-medium sm:hidden">Shadcn</span>
                            </div>
                            <div className="border-border flex w-full items-center justify-start px-6 pb-4 sm:w-40 sm:justify-center sm:border-0 sm:py-4">
                                {row.discohook === true ? (
                                    <Check className="size-5 text-green-600" />
                                ) : row.discohook === "partial" ? (
                                    <Check className="size-5 text-yellow-500" />
                                ) : row.discohook === false && row.tooltip ? (
                                    <span className="inline-block h-5">—</span>
                                ) : (
                                    <X className="text-destructive size-5" />
                                )}
                                <span className="text-muted-foreground ml-2 text-xs font-medium sm:hidden">Bootstrap</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export { Compare };
