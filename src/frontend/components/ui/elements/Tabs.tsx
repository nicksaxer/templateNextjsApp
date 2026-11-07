'use client';

import { type ReactNode, useId, useRef, useState } from 'react';
import styles from './Tabs.module.css';

export interface Tab {
    label: string;
    content: ReactNode;
}

export default function Tabs({tabs, label}: {tabs: readonly Tab[]; label: string}) {
    const [active, setActive] = useState(0);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const id = useId();

    function keyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
        let next = index;
        if (event.key === 'ArrowRight') {next = (index + 1) % tabs.length;} else if (event.key === 'ArrowLeft') {next = (index - 1 + tabs.length) % tabs.length;} else if (event.key === 'Home') {next = 0;} else if (event.key === 'End') {next = tabs.length - 1;} else {
            return;
        }
        event.preventDefault();
        setActive(next);
        refs.current[next]?.focus();
    }

    return (
        <div>
            <div role="tablist" aria-label={label} className={styles.tabs}>
                {tabs.map((tab, index) => (
                    <button key={tab.label} ref={node => { refs.current[index] = node }} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => keyDown(event, index)} >
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map((tab, index) => (
                <div key={tab.label} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0}>
                    {tab.content}
                </div>
            ))}
        </div>
    );
}
