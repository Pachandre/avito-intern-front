import styles from "./Expander.module.css";
import type { ChildrenProps } from "../types";

export default function Expander({ children }: ChildrenProps) {
    return <div className={styles.expander}>{children}</div>;
}
