import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App as AntdApp } from "antd";
import {
    Navigate,
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import List from "./routes/List.tsx";
import Stats from "./routes/Stats.tsx";
import Item from "./routes/Item.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ShortcutProvider } from "react-keybind";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="list" replace />,
            },
            {
                path: "list",
                element: <List />,
            },
            {
                path: "stats",
                element: <Stats />,
            },
            {
                path: "item/:id",
                element: <Item />,
            },
        ],
    },
]);

createRoot(document.getElementById("root") as HTMLDivElement).render(
    <StrictMode>
        <ShortcutProvider>
            <QueryClientProvider client={queryClient}>
                <AntdApp>
                    <RouterProvider router={router} />
                </AntdApp>
            </QueryClientProvider>
        </ShortcutProvider>
    </StrictMode>
);
