import Title from "antd/es/typography/Title";
import type { TAdvertisement } from "../types";
import styles from "./AdCard.module.css";
import { Button, Image, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

type Props = {
    ad: TAdvertisement;
    ids: number[];
    currentIndex: number;
};

export default function AdCard({ ad, ids, currentIndex }: Props) {
    const navigate = useNavigate();
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/item/${ad.id}`, {
            state: {
                ids,
                currentIndex,
            },
        });
    };
    return (
        <article className={styles["ad-card"]}>
            <Image
                preview={false}
                src={ad.images[0]}
                alt="Фото товара"
                loading="lazy"
                className={styles.image}
                wrapperClassName={styles.image}
            />
            <Title level={5} className={styles.title} style={{ margin: "0" }}>
                {ad.title}
            </Title>
            <Text className={styles.price}>
                <span>{ad.price}</span>
                <span>₽</span>
            </Text>
            <div className={styles.meta}>
                <Text type="secondary">{ad.category}</Text>
                <Text type="secondary">
                    <time dateTime={ad.createdAt}>
                        {new Date(ad.createdAt).toLocaleDateString("ru-RU")}
                    </time>
                </Text>
            </div>
            <Button className={styles.details} onClick={handleClick}>
                Открыть
            </Button>
        </article>
    );
}
