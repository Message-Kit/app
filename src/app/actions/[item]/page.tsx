export default function Page({ params }: { params: { item: string } }) {
    return <div>Chosen action item: {params.item}</div>;
}
