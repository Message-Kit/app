import { create } from "zustand";

type ErrorsState = {
    errorList: string[];
    setErrorList: (errors: string[]) => void;
};

export const useErrorListStore = create<ErrorsState>((set) => ({
    errorList: [],
    setErrorList: (errors) => set({ errorList: errors }),
}));
