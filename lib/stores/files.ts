import { create } from "zustand";

type FilesStore = {
    files: File[];
    setFiles: (files: File[]) => void;
};

const useFilesStore = create<FilesStore>((set) => ({
    files: [],
    setFiles: (files) => set({ files }),
}));

export default useFilesStore;
