import { create } from "zustand";

export type AttachmentPayload = {
    key: string;
    name: string;
    mimeType: string;
    dataBase64: string;
};

type AttachmentStore = {
    items: Record<string, AttachmentPayload>;
    addMany: (attachments: AttachmentPayload[]) => void;
    remove: (key: string) => void;
    clear: () => void;
    getAll: () => AttachmentPayload[];
};

export const useAttachmentStore = create<AttachmentStore>((set, get) => ({
    items: {},
    addMany: (attachments) =>
        set((state) => ({
            items: attachments.reduce<Record<string, AttachmentPayload>>(
                (acc, att) => {
                    acc[att.key] = att;
                    return acc;
                },
                { ...state.items },
            ),
        })),
    remove: (key) =>
        set((state) => {
            const { [key]: _removed, ...rest } = state.items;
            return { items: rest };
        }),
    clear: () => set({ items: {} }),
    getAll: () => Object.values(get().items),
}));
