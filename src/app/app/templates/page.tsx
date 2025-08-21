"use client";

import TemplateItem from "@/components/template-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search } from "lucide-react";

export default function Page() {
    return (
        <div className="py-16 px-4">
            <div className="flex flex-col gap-2">
                <span className="text-4xl font-display font-bold">
                    Templates
                </span>
                <span className="text-muted-foreground">
                    Templates allow you to create messages that can be used in
                    your server.
                </span>
            </div>
            <div className="flex gap-2 mt-4 md:mt-12">
                <div className="relative w-full">
                    <Input
                        className="peer pe-9"
                        placeholder="Search templates"
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                        <Search size={16} aria-hidden="true" />
                    </div>
                </div>
                <Button size={"icon"} variant={"ghost"}>
                    <Filter />
                </Button>
                <Button>
                    <Plus />
                    New Template
                </Button>
            </div>
            <div className="flex flex-col gap-2 mt-2">
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
                <TemplateItem />
            </div>
        </div>
    );
}
