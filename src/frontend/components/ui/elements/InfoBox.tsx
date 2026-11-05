'use client';

import { type ComponentPropsWithoutRef, useId } from 'react';
import styles from './InfoBox.module.css';

export default function InfoBox({children, className = '', ...props}: ComponentPropsWithoutRef<'span'>) {
    const id = useId();

    return (
        <span {...props} className={`${styles.InfoWrapper} ${className}`}>
            <span className={styles.icon} tabIndex={0} aria-label="More information" aria-describedby={id}>
                <i className="bi bi-info-circle" aria-hidden="true" />
            </span>
            <span id={id} className={styles.text} role="tooltip">{children}</span>
        </span>
    );
}
