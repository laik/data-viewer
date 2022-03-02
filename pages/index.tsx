import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";

const Maps2Layout = dynamic(
    () => {
        return import("../components/+maps2/layout");
    },
    { ssr: false }
);

export default function Home() {
    return (
        < div className={styles.full} >
            <Maps2Layout></Maps2Layout>
        </div >
    );
}
