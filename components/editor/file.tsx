import NewBuilder from "../new-builder";

export default function File({
    onMoveUp,
    onMoveDown,
    onRemove,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
}) {
    return (
        <NewBuilder name="File" onMoveUp={onMoveUp} onMoveDown={onMoveDown} onRemove={onRemove}>
            hi
        </NewBuilder>
    );
}
