import type { ComponentPropsWithoutRef } from 'react';
import type { Tone } from './AlertBadge';
import styles from './Badge.module.css';

export default function Badge({tone = 'info', className, children, ...props}: ComponentPropsWithoutRef<'span'> & {tone?: Tone}) {
    return (
        <span {...props} className={`${styles.badge}${className ? ` ${className}` : ''}`} data-tone={tone}>
            {children}
        </span>
    );
}
