import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Button,
    Descriptions,
    Timeline,
    Spin,
    Typography,
    Alert,
    Image,
    Layout,
    Popover,
    Radio,
} from "antd";
import {
    ArrowLeftOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import styles from "./Item.module.css";
import { approveAd, fetchAd, rejectAd } from "../api/ads";
import Title from "antd/es/typography/Title";
import Expander from "../components/Expander";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShortcut } from "react-keybind";
import { CReason, type TAdvertisement } from "../types";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

export default function Item() {
    const { id } = useParams<{ id: string }>();
    // @ts-expect-error
    const { registerShortcut, unregisterShortcut } = useShortcut();
    const navigate = useNavigate();
    const location = useLocation();
    const rejectBtn = useRef<HTMLButtonElement>(null);
    const approveBtn = useRef<HTMLButtonElement>(null);

    const ids: number[] | undefined = location.state?.ids;
    const currentIndex: number | undefined = location.state?.currentIndex;

    const { data, isLoading, error } = useQuery({
        queryKey: ["ad", id],
        queryFn: () => fetchAd({ id: id ? parseInt(id) : -1 }),
        enabled: !!id,
    });

    const [ad, setAd] = useState<TAdvertisement | undefined>(data);
    useEffect(() => {
        setAd(data);
    }, [data]);

    const goToPrev = useCallback(() => {
        if (currentIndex === undefined || ids === undefined) return;

        if (currentIndex > 0) {
            const prevId = ids[currentIndex - 1];
            navigate(`/item/${prevId}`, {
                replace: true,
                state: {
                    ids,
                    currentIndex: currentIndex - 1,
                },
            });
        }
    }, [currentIndex, ids, navigate]);

    const goToNext = useCallback(() => {
        if (currentIndex === undefined || ids === undefined) return;

        if (currentIndex < ids.length - 1) {
            const nextId = ids[currentIndex + 1];
            navigate(`/item/${nextId}`, {
                replace: true,
                state: {
                    ids,
                    currentIndex: currentIndex + 1,
                },
            });
        }
    }, [currentIndex, ids, navigate]);

    const approve = useCallback(() => {
        if (ad === undefined) return;
        approveAd({ id: ad.id }).then((res) => {
            setAd((prev) =>
                prev
                    ? {
                          ...prev,
                          moderationHistory: res.ad.moderationHistory,
                      }
                    : prev
            );
            ad.moderationHistory = res.ad.moderationHistory;
        });
    }, [ad]);
    const reject = useCallback(
        (reason: string, comment: string | undefined) => {
            if (ad === undefined) return;
            rejectAd({ id: ad.id, reason, comment }).then((res) => {
                setAd((prev) =>
                    prev
                        ? {
                              ...prev,
                              moderationHistory: res.ad.moderationHistory,
                          }
                        : prev
                );
            });
        },
        [ad]
    );

    useEffect(() => {
        registerShortcut(
            goToPrev,
            ["ArrowLeft"],
            "Previous ad",
            "go to previous ad"
        );
        registerShortcut(goToNext, ["ArrowRight"], "Next ad", "go to next ad");
        registerShortcut(
            () => approveBtn.current?.click(),
            ["A"],
            "Approve",
            "approve this advertisement"
        );
        registerShortcut(
            () => rejectBtn.current?.click(),
            ["D"],
            "Reject",
            "reject this advertisement"
        );

        return () => {
            unregisterShortcut(["ArrowLeft"]);
            unregisterShortcut(["ArrowRight"]);
            unregisterShortcut(["A"]);
            unregisterShortcut(["D"]);
        };
    }, [goToNext, goToPrev]);

    const [reason, setReason] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const handleSendReject = () => {
        reject(reason, reason === "Другое" ? comment : undefined);
    };

    const rejectPopover = (
        <Alert
            type="error"
            message={
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                    }}
                >
                    <Text type="danger">Причина</Text>
                    <Radio.Group
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                        name="Причина"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        {CReason.map((r, idx) =>
                            r !== "Другое" ? (
                                <Radio key={idx} value={r}>
                                    {r}
                                </Radio>
                            ) : (
                                <Radio key={idx} value={r}>
                                    {r}
                                    <TextArea
                                        autoSize={{ minRows: 3 }}
                                        value={comment ?? ""}
                                        disabled={reason !== "Другое"}
                                        onPointerDown={() =>
                                            setReason("Другое")
                                        }
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                    />
                                </Radio>
                            )
                        )}
                    </Radio.Group>
                    <Button
                        danger
                        color="danger"
                        style={{ alignSelf: "end", marginTop: "16px" }}
                        onClick={handleSendReject}
                    >
                        Отправить
                    </Button>
                </div>
            }
        />
    );

    const hasPrev = currentIndex !== undefined && currentIndex > 0;
    const hasNext =
        currentIndex !== undefined &&
        ids !== undefined &&
        currentIndex >= 0 &&
        currentIndex < ids.length - 1;

    if (isLoading || error || ad === undefined) {
        return (
            <Expander>
                {isLoading ? (
                    <Spin size="large" />
                ) : (
                    <Alert
                        type="error"
                        message={
                            error
                                ? "Ошибка загрузки объявления"
                                : "Объявление не найдено"
                        }
                    />
                )}
            </Expander>
        );
    }

    const maxChars = Object.keys(ad.characteristics).reduce(
        (prev, cur) => Math.max(prev, cur.length),
        0
    );

    return (
        <Layout style={{ height: "100%", overflow: "hidden" }}>
            <AppHeader>Объявление {ad.id}</AppHeader>
            <Content
                style={{
                    padding: "0 8px",
                    overflow: "scroll",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div className={styles.content}>
                    <div className={styles.carousel}>
                        <Image.PreviewGroup>
                            {ad.images.map((img, idx) => (
                                <Image
                                    preview={{
                                        keyboard: true,
                                        destroyOnHidden: true,
                                    }}
                                    key={idx}
                                    src={img}
                                    height={"100%"}
                                    style={{
                                        height: "100%",
                                        width: "auto",
                                    }}
                                    className={styles.carouselImage}
                                    alt={`${ad.title} - фото ${idx + 1}`}
                                />
                            ))}
                        </Image.PreviewGroup>
                    </div>

                    <div className={styles.moderation}>
                        <Title level={3}>История модерации</Title>
                        <Timeline
                            mode="right"
                            rootClassName={styles.timeline}
                            items={ad.moderationHistory
                                .sort((a, b) => {
                                    const t1 = new Date(a.timestamp);
                                    const t2 = new Date(b.timestamp);
                                    return t1.getTime() - t2.getTime();
                                })
                                .flatMap((item) => ({
                                    label: new Date(
                                        item.timestamp
                                    ).toLocaleString("ru-RU"),
                                    color:
                                        item.action === "approved"
                                            ? "green"
                                            : item.action === "rejected"
                                            ? "red"
                                            : "yellow",
                                    children: (
                                        <div>
                                            <strong>
                                                {item.moderatorName}
                                            </strong>
                                            <div>{item.comment}</div>
                                            {item.reason && (
                                                <div>
                                                    Причина: {item.reason}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                }))}
                        />
                    </div>

                    <Title level={2} style={{ marginBottom: "0" }}>
                        {ad.title}
                    </Title>
                    <div className={styles.price}>
                        <Text>{ad.price}</Text>
                        <Text>₽</Text>
                    </div>
                    <Text className={styles.description}>{ad.description}</Text>

                    <Descriptions
                        bordered
                        column={1}
                        rootClassName={styles.characteristics}
                    >
                        {Object.entries(ad.characteristics).map(
                            ([key, value]) => (
                                <Descriptions.Item
                                    key={key}
                                    label={key}
                                    styles={{
                                        content: {
                                            padding: ".5em 1em",
                                        },
                                        label: {
                                            width: `${maxChars}ch`,
                                            padding: ".5em 1em",
                                            textAlign: "right",
                                        },
                                    }}
                                >
                                    {String(value)}
                                </Descriptions.Item>
                            )
                        )}
                    </Descriptions>

                    <Descriptions
                        bordered
                        title={"Продавец"}
                        rootClassName={styles.seller}
                        styles={{ header: { marginBottom: "0" } }}
                    >
                        <Descriptions.Item label="Имя">
                            {ad.seller.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Рейтинг">
                            {ad.seller.rating}
                        </Descriptions.Item>
                        <Descriptions.Item label="Объявлений">
                            {ad.seller.totalAds}
                        </Descriptions.Item>
                        <Descriptions.Item label="Зарегистрирован">
                            <time>
                                {new Date(
                                    ad.seller.registeredAt
                                ).toLocaleDateString("ru-RU")}
                            </time>
                        </Descriptions.Item>
                    </Descriptions>

                    <div className={styles.actions}>
                        <div className={styles.actionsMain}>
                            <Button
                                type="primary"
                                size="large"
                                color="green"
                                onClick={approve}
                                ref={approveBtn}
                            >
                                Одобрить
                            </Button>
                            <Popover trigger="click" content={rejectPopover}>
                                <Button
                                    danger
                                    size="large"
                                    color="danger"
                                    ref={rejectBtn}
                                >
                                    Отклонить
                                </Button>
                            </Popover>
                        </div>
                        <Button
                            size="large"
                            style={{ color: "#f0b609", borderColor: "#f0b609" }}
                        >
                            Вернуть на доработку
                        </Button>
                    </div>
                </div>
            </Content>

            <AppFooter>
                <div className={styles.navigation}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={
                            currentIndex === undefined
                                ? () => navigate("/list")
                                : () => navigate(-1)
                        }
                    >
                        Назад к списку
                    </Button>

                    {currentIndex !== undefined && (
                        <div className={styles.prevNext}>
                            <Button
                                icon={<LeftOutlined />}
                                onClick={goToPrev}
                                disabled={!hasPrev}
                            >
                                Предыдущее
                            </Button>
                            <Button
                                icon={<RightOutlined />}
                                onClick={goToNext}
                                disabled={!hasNext}
                                iconPosition="end"
                            >
                                Следующее
                            </Button>
                        </div>
                    )}
                </div>
            </AppFooter>
        </Layout>
    );
}
