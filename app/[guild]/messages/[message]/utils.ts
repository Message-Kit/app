import type { APIContainerComponent, APIMessageTopLevelComponent } from "discord-api-types/v10";

// move a top-level component up (simple swap within top-level)
export function moveTopLevelUp(
    components: APIMessageTopLevelComponent[],
    index: number,
): APIMessageTopLevelComponent[] {
    if (index === 0) return components;
    const next = [...components];
    const item = next[index];
    const prev = next[index - 1];
    next[index - 1] = item;
    next[index] = prev;
    return next;
}

// move a top-level component down (simple swap within top-level)
export function moveTopLevelDown(
    components: APIMessageTopLevelComponent[],
    index: number,
): APIMessageTopLevelComponent[] {
    const lastIndex = components.length - 1;
    if (index === lastIndex) return components;
    const next = [...components];
    const item = next[index];
    const after = next[index + 1];
    next[index + 1] = item;
    next[index] = after;
    return next;
}

// move a child inside a container up (no moving out)
export function moveChildUp(
    components: APIMessageTopLevelComponent[],
    containerIndex: number,
    childIndex: number,
): APIMessageTopLevelComponent[] {
    const next = [...components];
    const container = next[containerIndex] as APIContainerComponent;
    const children = [...container.components];
    if (childIndex === 0) return components;
    const item = children[childIndex];
    const before = children[childIndex - 1];
    children[childIndex - 1] = item;
    children[childIndex] = before;
    next[containerIndex] = { ...container, components: children };
    return next;
}

// move a child inside a container down (no moving out)
export function moveChildDown(
    components: APIMessageTopLevelComponent[],
    containerIndex: number,
    childIndex: number,
): APIMessageTopLevelComponent[] {
    const next = [...components];
    const container = next[containerIndex] as APIContainerComponent;
    const children = [...container.components];
    const last = children.length - 1;
    if (childIndex === last) return components;
    const item = children[childIndex];
    const after = children[childIndex + 1];
    children[childIndex + 1] = item;
    children[childIndex] = after;
    next[containerIndex] = { ...container, components: children };
    return next;
}
