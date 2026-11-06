'use client';

import { type ComponentPropsWithoutRef, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import styles from './InfoBox.module.css';

export default function InfoBox({children, className = '', ...props}: ComponentPropsWithoutRef<'span'>) {
    const id = useId();

    return (
        <span {...props} className={`${styles.InfoWrapper} ${className}`}>
            <FontAwesomeIcon icon={faCircleQuestion} className={styles.icon} aria-hidden="true" tabIndex={0} aria-label="More information" aria-describedby={id} />
            <span id={id} className={styles.text} role="tooltip">{children}</span>
        </span>
    );
}
