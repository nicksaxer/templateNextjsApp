'use client';

import { useState } from 'react';
import Button from '@frontend/components/ui/inputs/Button';
import { setTheme, type Theme } from '@frontend/utils/prefs';

export default function ThemeSwitch({initialTheme}: {initialTheme: Theme}) {
    const [theme, updateTheme] = useState(initialTheme);
    return (
        <Button
            simple
            iconOnly
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            bsicon={theme === 'light' ? 'bi-moon' : 'bi-sun'}
            onClick={() => {
                const next = theme === 'light' ? 'dark' : 'light';
                setTheme(next);
                updateTheme(next);
            }}
        />
    );
}
