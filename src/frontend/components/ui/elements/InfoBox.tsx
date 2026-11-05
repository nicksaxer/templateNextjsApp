'use client';

import { type ComponentPropsWithoutRef, useId, useState } from 'react';
import Icon from './Icon';
import styles from './Feedback.module.css';

export default function InfoBox({children, className = '', ...props}: ComponentPropsWithoutRef<'span'>) {
    const id = useId();
    const [dismissed, setDismissed] = useState(false);
    return (
        <span {...props} className={`${styles.info} ${className}`} data-dismissed={dismissed} onMouseLeave={() => setDismissed(false)} onBlur={() => setDismissed(false)}>
            <button type="button" aria-label="More information" aria-describedby={id} onKeyDown={event => {if (event.key === 'Escape') {setDismissed(true);}}}>
                <Icon name="info-circle" />
            </button>
            <span role="tooltip" id={id} className={styles.tooltip}>
                {children}
            </span>
        </span>
    );
}
