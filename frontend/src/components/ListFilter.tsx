import { Button, InputNumber, Select, Tooltip, type SelectProps } from "antd";
import styles from "./ListFilter.module.css";
import {
    CSortKey,
    CSortKeyLabels,
    CStatus,
    CStatusLabels,
    type TStatus,
} from "../types";
import { useURLParams as useURLParams } from "../hooks/useURLParams";
import Title from "antd/es/typography/Title";
import Input, { type InputRef } from "antd/es/input/Input";
import { useEffect, useRef, type ChangeEvent } from "react";
import {
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import { useShortcut } from "react-keybind";

const statusOptions: SelectProps["options"] = CStatus.map((s) => ({
    value: s,
    label: CStatusLabels[s],
}));

export default function ListFilter() {
    const { filters, setFilters, resetFilters, sort, setSort } = useURLParams();
    // @ts-expect-error
    const { registerShortcut, unregisterShortcut } = useShortcut();
    const maskRef = useRef<InputRef>(null);

    const statusChange = (values: TStatus[]) => {
        setFilters((prev) => ({
            ...prev,
            status: {
                pending: values.includes("pending"),
                approved: values.includes("approved"),
                rejected: values.includes("rejected"),
                draft: values.includes("draft"),
            },
        }));
    };

    useEffect(() => {
        registerShortcut(
            () => {
                maskRef.current?.focus({
                    cursor: "all",
                });
            },
            ["/"],
            "Search",
            "focus in search field"
        );
        return () => {
            unregisterShortcut(["/"]);
        };
    }, [maskRef]);

    const searchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const mask = e.currentTarget.value;
        setFilters((prev) => ({
            ...prev,
            mask,
        }));
    };

    const selectedStatuses: TStatus[] = CStatus.filter(
        (status) => filters.status[status]
    );

    return (
        <div className={styles.container}>
            <Title level={4} style={{ textAlign: "center" }}>
                Сортировка
            </Title>
            <div className={styles.sort}>
                <Select
                    value={sort.key}
                    style={{ flexGrow: 1 }}
                    onChange={(v) => {
                        setSort({
                            ...sort,
                            key: v,
                        });
                    }}
                >
                    {CSortKey.map((k, idx) => (
                        <Select.Option value={k} key={idx}>
                            {CSortKeyLabels[k]}
                        </Select.Option>
                    ))}
                </Select>
                <Tooltip
                    title={
                        sort.key === "createdAt"
                            ? sort.order === "asc"
                                ? "Сначала старые"
                                : "Сначала новые"
                            : sort.key === "price"
                            ? sort.order === "asc"
                                ? "Более дорогие"
                                : "Менее дорогие"
                            : sort.order === "asc"
                            ? "Более приоритетные"
                            : "Менее приоритетные"
                    }
                >
                    <Button
                        icon={
                            sort.order === "asc" ? (
                                <SortAscendingOutlined />
                            ) : (
                                <SortDescendingOutlined />
                            )
                        }
                        onClick={() =>
                            setSort({
                                ...sort,
                                order: sort.order === "asc" ? "desc" : "asc",
                            })
                        }
                    />
                </Tooltip>
            </div>
            <Title level={4} style={{ textAlign: "center", marginTop: "2em" }}>
                Фильтры
            </Title>
            <div className={styles.filters}>
                <Input
                    allowClear
                    type="text"
                    ref={maskRef}
                    placeholder="Поиск"
                    onChange={searchChange}
                    value={filters.mask}
                />
                <Select
                    className={styles["status-select"]}
                    mode="multiple"
                    allowClear
                    placeholder="Статусы"
                    value={selectedStatuses}
                    onChange={statusChange}
                    options={statusOptions}
                    optionFilterProp="label"
                ></Select>
                <Input
                    allowClear
                    type="text"
                    placeholder="ID категории"
                    value={filters.categoryId?.toString()}
                    onChange={(e) => {
                        const id = parseInt(e.target.value);
                        setFilters((prev) => ({
                            ...prev,
                            categoryId: isNaN(id) ? null : id,
                        }));
                    }}
                />
                <div className={styles.priceRange}>
                    <InputNumber
                        title="минимальная цена"
                        style={{ flexGrow: 1 }}
                        value={filters.price.from}
                        placeholder="цена от"
                        min={0}
                        onChange={(e) =>
                            e !== null &&
                            setFilters((prev) => ({
                                ...prev,
                                price: {
                                    ...prev.price,
                                    from: e,
                                },
                            }))
                        }
                    />
                    <InputNumber
                        title="максимальная цена"
                        style={{ flexGrow: 1 }}
                        value={filters.price.to}
                        min={0}
                        placeholder="цена до"
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                price: {
                                    ...prev.price,
                                    to: e,
                                },
                            }))
                        }
                    />
                </div>
                <Button onClick={resetFilters}>Сбросить фильтры</Button>
            </div>
        </div>
    );
}
