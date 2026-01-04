"use client";

import { createContext, useContext, useLayoutEffect, useState, useCallback, useMemo } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getStoredTheme(): Theme {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored || "dark";
}

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
    if (theme === "system") {
        return getSystemTheme();
    }
    return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize with computed resolved theme to avoid hydration issues
    const [internalState, setInternalState] = useState(() => {
        const initialTheme = getStoredTheme();
        return {
            theme: initialTheme,
            resolvedTheme: resolveTheme(initialTheme),
        };
    });

    const applyThemeToDOM = useCallback((resolved: "light" | "dark") => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
    }, []);

    // Apply theme to DOM (no setState here, just DOM manipulation)
    useLayoutEffect(() => {
        applyThemeToDOM(internalState.resolvedTheme);
    }, [internalState.resolvedTheme, applyThemeToDOM]);

    // Listen for system theme changes when in system mode
    useLayoutEffect(() => {
        if (internalState.theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            const newResolved = e.matches ? "dark" : "light";
            setInternalState((prev) => ({ ...prev, resolvedTheme: newResolved }));
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [internalState.theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        const newResolved = resolveTheme(newTheme);
        setInternalState({ theme: newTheme, resolvedTheme: newResolved });
        localStorage.setItem("theme", newTheme);
    }, []);

    const contextValue = useMemo(
        () => ({
            theme: internalState.theme,
            setTheme,
            resolvedTheme: internalState.resolvedTheme,
        }),
        [internalState.theme, internalState.resolvedTheme, setTheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

