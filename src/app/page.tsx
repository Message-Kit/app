"use client";

import { useGuildStore } from "@/stores/guild";

export default function Page() {
    const { selectedGuild } = useGuildStore();

    if (!selectedGuild) {
        return <div>no guild selected</div>;
    }

    return (
        <div>
            <h2>Selected Guild</h2>
            <div>Name: {selectedGuild.name}</div>
            <div>ID: {selectedGuild.id}</div>
        </div>
    );
}
