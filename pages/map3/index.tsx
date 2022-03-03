import dynamic from "next/dynamic";
import styles from "../../styles/Home.module.css";

const Maps3Layout = dynamic(
    () => {
        return import("../../components/+maps3/layout");
    },
    { ssr: false }
);

export default function Home() {
    return (
        < div className={styles.full} >
            <Maps3Layout></Maps3Layout>
        </div >
    );
}

