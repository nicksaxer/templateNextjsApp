import type { ReactNode } from 'react';
import Icon from './Icon';
import cx from '@frontend/utils/classNames';
import styles from './EmptyState.module.css';

export default function EmptyState({title, children, action, icon = 'inbox', className}: {title: string; children?: ReactNode; action?: ReactNode; icon?: ReactNode; className?: string}) {
    return (
        <div className={cx(styles.empty, className)}>
            {typeof icon === 'string' ? <Icon name={icon} /> : icon}
            <h3>{title}</h3>
            {children != null && <p>{children}</p>}
            {action}
        </div>
    );
}
