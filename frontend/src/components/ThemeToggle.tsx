import useTheme from "../hooks/useTheme";
import { Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={theme === "dark"}
            onChange={toggleTheme}
        />
    );
}
