import { Card } from "antd";
import styles from "./StatCard.module.css";
import Text from "antd/es/typography/Text";

type Props = {
    gridArea: string;
    value: unknown;
    label: string;
};

export default function StatCard({ gridArea, value, label }: Props) {
    return (
        <Card className={styles.card} style={{ gridArea }} title={label} styles={{
            body: {
                padding: "0",
                width: "100%",
                height: "100%"
            },
            title: {
                textWrap: "wrap",
            }
        }}>
            <Text className={styles.value}>
                <>{value}</>
            </Text>
        </Card>
    );
}
