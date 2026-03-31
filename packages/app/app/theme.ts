export type ThemeMode = 'light' | 'dark'
export type AccentKey = 'orange' | 'violet' | 'blue' | 'red' | 'green'

export type ThemeColors = {
    bg: string
    surface: string
    border: string
    text: string
    textMuted: string
    accent: string
    placeholder: string
}

export const ACCENT_COLORS: Record<AccentKey, string> = {
    orange: '#f97316',
    violet: '#8b5cf6',
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#22c55e',
}

export function getColors(mode: ThemeMode, accent: AccentKey): ThemeColors {
    const a = ACCENT_COLORS[accent]
    if (mode === 'dark') {
        return {
            bg: '#1e1f22',
            surface: '#2b2d31',
            border: '#3a3c40',
            text: '#f2f2f2',
            textMuted: '#949ba4',
            placeholder: '#5c6370',
            accent: a,
        }
    }
    return {
        bg: '#f4f4f5',
        surface: '#ffffff',
        border: '#e4e4e7',
        text: '#18181b',
        textMuted: '#71717a',
        placeholder: '#a1a1aa',
        accent: a,
    }
}
