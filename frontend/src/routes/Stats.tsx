import { DatePicker, Layout, Radio } from "antd";
import AppHeader from "../components/AppHeader";
import { Content } from "antd/es/layout/layout";
import styles from "./Stats.module.css";
import StatCard from "../components/StatCard";
import { useQuery } from "@tanstack/react-query";
import {
    fetchActivity,
    fetchCategories,
    fetchDecisions,
    fetchSummary,
} from "../api/stats";
import { useState } from "react";
import { CPeriod, CPeriodLabels, type TPeriod, type TRequests } from "../types";
import dayjs, { Dayjs } from "dayjs";
import WeeklyChart from "../components/WeeklyChart";
import DescisionsChart from "../components/DescisionsChart";
import CategoriesChart from "../components/CategoriesChart";

function round(x: number, d: number = 0) {
    const e = Math.pow(10, d);
    return Math.round(x * e) / e;
}

function toDateString(d: Dayjs) {
    return d.format("YYYY-MM-DD");
}

export default function Stats() {
    const [period, setPeriod] = useState<TPeriod>("week");
    const [dates, setDates] = useState<[start: Dayjs, end: Dayjs]>([
        dayjs(),
        dayjs().add(1, "week"),
    ]);
    const { data: summary } = useQuery({
        queryKey: ["summary", period, dates],
        queryFn: async () => {
            const query: TRequests["StatsSummary"] = { period };
            if (period === "custom") {
                query.startDate = toDateString(dates[0]);
                query.endDate = toDateString(dates[1]);
            }
            return await fetchSummary(query);
        },
    });
    const { data: activity } = useQuery({
        queryKey: ["activity", period, dates],
        queryFn: async () => {
            const query: TRequests["StatsActivity"] = { period };
            if (period === "custom") {
                query.startDate = toDateString(dates[0]);
                query.endDate = toDateString(dates[1]);
            }
            return await fetchActivity(query);
        },
    });
    const { data: descisions } = useQuery({
        queryKey: ["decision", period, dates],
        queryFn: async () => {
            const query: TRequests["StatsDecisions"] = { period };
            if (period === "custom") {
                query.startDate = toDateString(dates[0]);
                query.endDate = toDateString(dates[1]);
            }
            return await fetchDecisions(query);
        },
    });
    const { data: categories } = useQuery({
        queryKey: ["categories", period, dates],
        queryFn: async () => {
            const query: TRequests["StatsCategories"] = { period };
            if (period === "custom") {
                query.startDate = toDateString(dates[0]);
                query.endDate = toDateString(dates[1]);
            }
            return await fetchCategories(query);
        },
    });
    const checked = summary?.totalReviewed ?? "";
    const approved =
        (summary && round(summary.approvedPercentage, 1) + "%") ?? "";
    const rejected =
        (summary && round(summary.rejectedPercentage, 1) + "%") ?? "";
    console.log(summary?.averageReviewTime);
    const averageTime =
        (summary && round(summary.averageReviewTime / 60, 1) + " мин") ?? "";

    return (
        <Layout style={{ height: "100%", overflow: "hidden" }}>
            <AppHeader>Статистика</AppHeader>
            <Content className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.periodContainer}>
                        <Radio.Group
                            style={{ flexGrow: "1" }}
                            defaultValue={CPeriod[0]}
                            block
                            optionType="button"
                            buttonStyle="solid"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            {CPeriod.map((p, idx) => (
                                <Radio key={idx} value={p}>
                                    {CPeriodLabels[p]}
                                </Radio>
                            ))}
                        </Radio.Group>
                        <DatePicker.RangePicker
                            onChange={(d) => {
                                if (d === null) return;
                                const [a, b] = d;
                                if (a === null || b === null) return;
                                setDates([a, b]);
                            }}
                            defaultValue={[dayjs(), dayjs().add(1, "week")]}
                            {...(period !== "custom"
                                ? { style: { display: "none" } }
                                : {})}
                        />
                    </div>
                    <StatCard
                        gridArea="chk"
                        label="Проверено"
                        value={checked}
                    />
                    <StatCard
                        gridArea="apr"
                        label="Одобрено"
                        value={approved}
                    />
                    <StatCard
                        gridArea="rej"
                        label="Отклонено"
                        value={rejected}
                    />
                    <StatCard
                        gridArea="avg"
                        label="Время проверки"
                        value={averageTime}
                    />
                    <WeeklyChart
                        data={
                            (activity &&
                                activity.map((v) => ({
                                    name: v.date,
                                    value:
                                        v.approved +
                                        v.rejected +
                                        v.requestChanges,
                                }))) ??
                            []
                        }
                        style={{
                            gridArea: "act",
                            width: "100%",
                            height: "300px",
                        }}
                    />
                    <DescisionsChart
                        data={
                            (descisions && [
                                {
                                    name: "Одобрено",
                                    value: round(descisions.approved, 2),
                                    fill: '#0ED864',
                                },
                                {
                                    name: "Отказано",
                                    value: round(descisions.rejected, 2),
                                    fill: "#FF5353",
                                },
                                {
                                    name: "Отправлено на доработку",
                                    value: round(descisions.requestChanges, 2),
                                    fill: "#F8B324",
                                },
                            ]) ??
                            []
                        }
                        style={{
                            gridArea: "pi1",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                    <CategoriesChart
                        data={
                            (categories &&
                                Object.entries(categories).map(([k, v]) => ({
                                    name: k,
                                    value: v,
                                }))) ??
                            []
                        }
                        style={{
                            gridArea: "pi2",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
}
