'use client';

import { type ReactNode, useId, useState } from 'react';
import SlideDown from '../animations/SlideDown';
import Icon from './Icon';
import styles from './Accordion.module.css';

export default function Accordion({title, children, defaultOpen = false}: {title: string; children: ReactNode; defaultOpen?: boolean}) {
    const [open, setOpen] = useState(defaultOpen);
    const id = useId();
    return (
        <div className={styles.accordion}>
            <h3>
                <button id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen(value => !value)}>
                    {title}
                    <Icon name={open ? 'dash' : 'plus'} />
                </button>
            </h3>
            <SlideDown id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} open={open}>
                <div className={styles.accordionBody}>{children}</div>
            </SlideDown>
        </div>
    );
}
