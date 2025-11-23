import { Header } from "antd/es/layout/layout";
import type { ChildrenProps } from "../types";
import useTheme from "../hooks/useTheme";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader({ children }: ChildrenProps) {
    const { theme } = useTheme();
    return (
        <Header
            style={{
                backgroundColor: theme === "dark" ? "#0f0f0f" : "#fafafa",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            {children}
            <ThemeToggle/>
        </Header>
    );
}
