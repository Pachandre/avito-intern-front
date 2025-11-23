import useLocalStorage from "use-local-storage";
import type { TTheme } from "../types";
import { useCallback, useLayoutEffect } from "react";

function getInitialTheme(): TTheme {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;

    if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    }
    return "light";
}

export default function useTheme() {
    const [theme, setTheme] = useLocalStorage<TTheme>(
        "theme",
        getInitialTheme()
    );

    useLayoutEffect(() => {
        document.documentElement.dataset["theme"] = theme;
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, [setTheme]);

    return { theme, setTheme, toggleTheme };
}
