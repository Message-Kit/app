import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function append<T>(array: readonly T[], item: T): T[] {
    return [...array, item];
}

export function removeAt<T>(array: readonly T[], index: number): T[] {
    const result = array.slice();
    result.splice(index, 1);
    return result;
}

export function updateAt<T>(array: readonly T[], index: number, updater: (oldValue: T) => T): T[] {
    const result = array.slice();
    result[index] = updater(result[index]);
    return result;
}

export function moveItem<T>(array: readonly T[], index: number, direction: "up" | "down"): T[] {
    const result = array.slice();
    if (direction === "up" && index > 0) {
        [result[index - 1], result[index]] = [result[index], result[index - 1]];
    }
    if (direction === "down" && index < result.length - 1) {
        [result[index + 1], result[index]] = [result[index], result[index + 1]];
    }
    return result;
}
