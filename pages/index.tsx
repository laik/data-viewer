import dynamic from "next/dynamic";

const Maps2Layout = dynamic(
    () => {
        return import("../components/+maps2/layout");
    },
    { ssr: false }
);

export default function Home() {
    return (
        <div style={{ minHeight: "1000px" }}>
            <Maps2Layout />
        </div>
    );
}
