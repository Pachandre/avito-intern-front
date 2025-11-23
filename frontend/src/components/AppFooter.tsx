import { Footer } from "antd/es/layout/layout";
import type { ChildrenProps } from "../types";

export default function AppFooter({ children }: ChildrenProps) {
    return (
        <Footer
            style={{
                position: "sticky",
                bottom: "0",
                padding: "10px 20px",
            }}
        >
            {children}
        </Footer>
    );
}
