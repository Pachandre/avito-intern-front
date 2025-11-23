import { Outlet } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import useTheme from "./hooks/useTheme";

export default function App() {
    const { theme: currentTheme } = useTheme();
    return (
        <ConfigProvider
            theme={{
                algorithm:
                    currentTheme === "dark"
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#97cf26",
                },
            }}
        >
            <Outlet />
        </ConfigProvider>
    );
}
