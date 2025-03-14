import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext(undefined);

export function ThemeProvider({
                                  children,
                                  defaultTheme = "system",
                                  storageKey = "myworkbench-theme",
                                  ...props
                              }) {
    const [theme, setTheme] = useState(() => {
        // Load from localStorage on component mount
        if (typeof window !== "undefined") {
            return localStorage.getItem(storageKey) || defaultTheme;
        }
        return defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove both light and dark classes
        root.classList.remove("light", "dark");

        // Handle system preference
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches ? "dark" : "light";

            root.classList.add(systemTheme);
            return;
        }

        // Add the appropriate class
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};