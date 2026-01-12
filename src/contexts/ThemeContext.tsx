import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    zoom: number;
    setZoom: (zoom: number) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'radar-theme-preference';
const ZOOM_STORAGE_KEY = 'radar-zoom-level';

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
}

function getStoredTheme(): Theme {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    }
    return 'system';
}

function getStoredZoom(): number {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(ZOOM_STORAGE_KEY);
        if (stored) {
            const parsed = parseFloat(stored);
            if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2) {
                return parsed;
            }
        }
    }
    return 1;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
    const [zoom, setZoomState] = useState<number>(() => getStoredZoom());
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
        const stored = getStoredTheme();
        return stored === 'system' ? getSystemTheme() : stored;
    });

    // Update resolved theme when theme or system preference changes
    const updateResolvedTheme = useCallback(() => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        // Apply to document
        const root = document.documentElement;
        if (resolved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Apply zoom
    useEffect(() => {
        const root = document.documentElement;
        // Adjust root font size (percentage based on 16px default)
        // 1 = 100%, 0.9 = 90%, etc.
        root.style.fontSize = `${zoom * 100}%`;
    }, [zoom]);

    // Set theme and persist
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
    }, []);

    // Set zoom and persist
    const setZoom = useCallback((newZoom: number) => {
        setZoomState(newZoom);
        localStorage.setItem(ZOOM_STORAGE_KEY, newZoom.toString());
    }, []);

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }, [resolvedTheme, setTheme]);

    // Apply theme on mount and when theme changes
    useEffect(() => {
        updateResolvedTheme();
    }, [updateResolvedTheme]);

    // Listen for system preference changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => updateResolvedTheme();

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme, updateResolvedTheme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, zoom, setZoom }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Hook seguro para usar fora do provider (retorna null se não houver contexto)
export function useThemeSafe() {
    return useContext(ThemeContext);
}
