import type { ComponentPropsWithoutRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleCheck, faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import cx from '@frontend/utils/classNames';
import styles from './AlertBadge.module.css';

export type Tone = 'info' | 'success' | 'warning' | 'danger';

export default function AlertBadge({tone = 'info', title, children, className, ...props}: ComponentPropsWithoutRef<'div'> & {tone?: Tone; title?: string}) {
    const icon = {info: faCircleInfo, success: faCircleCheck, warning: faTriangleExclamation, danger: faCircleXmark}[tone];
    return (
        <div role={tone === 'danger' ? 'alert' : 'status'} {...props} className={cx(styles.alert, className)} data-tone={tone}>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
            <div>
                {title && <strong>{title}</strong>}
                {children && <div>{children}</div>}
            </div>
        </div>
    );
}
