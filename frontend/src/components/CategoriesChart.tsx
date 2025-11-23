import type React from "react";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import useTheme from "../hooks/useTheme";

export default function CategoriesChart({
    data,
    style,
}: {
    data: { name: string; value: number }[];
    style: React.CSSProperties;
}) {
    const { theme } = useTheme();
    return (
        <PieChart responsive style={style}>
            <Tooltip
                contentStyle={{
                    backgroundColor: theme === "dark" ? "#0f0f0f" : "#fafafa",
                }}
				itemStyle={{
					color: theme === "light" ? "#363636" : "#fafafa"
				}}
            />
            <Legend />
            <Pie
                data={data}
                innerRadius="80%"
                outerRadius="100%"
                strokeWidth={5}
                stroke={theme === "dark" ? "#0f0f0f" : "#fafafa"}
                dataKey={"value"}
            />
        </PieChart>
    );
}
