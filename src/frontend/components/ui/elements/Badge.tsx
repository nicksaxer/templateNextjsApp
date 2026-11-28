import type { ComponentPropsWithoutRef } from 'react';
import type { Tone } from './AlertBadge';
import cx from '@frontend/utils/classNames';
import styles from './Badge.module.css';

export default function Badge({tone = 'info', className, children, ...props}: ComponentPropsWithoutRef<'span'> & {tone?: Tone}) {
    return (
        <span {...props} className={cx(styles.badge, className)} data-tone={tone}>
            {children}
        </span>
    );
}
