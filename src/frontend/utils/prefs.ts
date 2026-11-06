export type Theme = 'light' | 'dark';

export function getTheme(value: string | undefined): Theme {
    return value === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}
