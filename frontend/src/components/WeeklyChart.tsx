import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import useTheme from "../hooks/useTheme";

type Props = {
    data: { name: string; value: number }[];
    style: React.CSSProperties;
};

export default function WeeklyChart({ data, style }: Props) {
    const { theme } = useTheme();
    return (
        <BarChart data={data} style={style}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width='auto' dataKey={"value"} />
            <Tooltip
                contentStyle={{
                    background: theme === "dark" ? "#0f0f0f" : "#fafafa",
                }}
            />
            <Legend />
            <Bar dataKey="value" fill="#97cf26" name="Активность" />
        </BarChart>
    );
}
