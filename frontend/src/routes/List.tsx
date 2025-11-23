import { Alert, Button, Layout, Pagination, Spin } from "antd";
import AdCard from "../components/AdCard";
import ListFilter from "../components/ListFilter";
import { useAds } from "../hooks/useAds";
import usePageLimit from "../hooks/usePageLimit";
import { useURLParams } from "../hooks/useURLParams";
import styles from "./List.module.css";
import { Content } from "antd/es/layout/layout";
import Expander from "../components/Expander";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import useTheme from "../hooks/useTheme";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function List() {
    const { pageLimit, setPageLimit } = usePageLimit();
    const { filters, sort, page, setPage } = useURLParams();
    const { data, error, isFetching } = useAds(filters, sort, page, pageLimit);
    const [collapsed, setCollapsed] = useState(false);
    const { theme } = useTheme();

    const ids = data?.ads.map((ad) => ad.id) ?? [];

    const onChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageLimit(newPageSize);
    };

    return (
        <Layout style={{ height: "100%", overflow: "hidden" }}>
            <AppHeader>
                <Button
                    type="text"
                    icon={
                        collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )
                    }
                    onClick={() => setCollapsed(!collapsed)}
                />
                Список объявлений
            </AppHeader>
            <Layout style={{ position: "relative" }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    collapsedWidth={0}
                    className={styles.aside}
                    width={256}
                    style={{
                        backgroundColor:
                            theme === "dark" ? "#0f0f0f" : "#fafafaff",
                    }}
                >
                    <ListFilter />
                </Sider>
                <Content className={styles.main}>
                    {error ? (
                        <Expander>
                            <Alert
                                type="error"
                                closable={false}
                                message="Ошибка при получении объявлений"
                            />
                        </Expander>
                    ) : isFetching ? (
                        <Expander>
                            <Spin />
                        </Expander>
                    ) : (
                        <div className={styles.ads}>
                            {data?.ads.map((ad, idx) => (
                                <AdCard
                                    ad={ad}
                                    key={ad.id}
                                    ids={ids}
                                    currentIndex={idx}
                                />
                            ))}
                        </div>
                    )}
                </Content>
            </Layout>
            <AppFooter>
                {data && (
                    <Pagination
                        showSizeChanger
                        pageSizeOptions={Array.from(
                            { length: 100 },
                            (_, k) => k + 1
                        )}
                        total={data.pagination.totalItems}
                        showTotal={(total) => `Всего ${total} объявлений`}
                        pageSize={pageLimit}
                        current={page}
                        onChange={onChange}
                        responsive
                    />
                )}
            </AppFooter>
        </Layout>
    );
}
