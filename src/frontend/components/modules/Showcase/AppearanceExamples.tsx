'use client';

import { useState } from 'react';
import Button from '@frontend/components/ui/inputs/Button';
import Switch from '@frontend/components/ui/inputs/Switch';
import { setTheme, type Theme } from '@frontend/utils/prefs';
import styles from './Showcase.module.css';

export default function AppearanceExamples({initialTheme}: {initialTheme: Theme}) {
    const [theme, updateTheme] = useState(initialTheme);
    const [palette, setPalette] = useState('guildmarket');
    function choosePalette(value: string) {
        document.documentElement.dataset.palette = value;
        setPalette(value);
    }
    return (
        <div className={styles.buttonRow}>
            <Button simple filled={palette === 'seppos'} aria-pressed={palette === 'seppos'} onClick={() => choosePalette('seppos')}>SeppOS</Button>
            <Button simple filled={palette === 'guildmarket'} aria-pressed={palette === 'guildmarket'} onClick={() => choosePalette('guildmarket')}>GuildMarket</Button>
            <span className={styles.row}>Dark mode <Switch label="Dark mode" checked={theme === 'dark'} onChange={checked => {const next = checked ? 'dark' : 'light'; updateTheme(next); setTheme(next);}} /></span>
        </div>
    );
}
