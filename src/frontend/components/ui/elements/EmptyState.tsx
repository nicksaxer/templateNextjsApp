import type { ReactNode } from 'react';
import Icon from './Icon';
import styles from './EmptyState.module.css';

export default function EmptyState({title, children, action, icon = 'inbox'}: {title: string; children?: ReactNode; action?: ReactNode; icon?: ReactNode}) {
    return (
        <div className={styles.empty}>
            {typeof icon === 'string' ? <Icon name={icon} /> : icon}
            <h3>{title}</h3>
            {children != null && <p>{children}</p>}
            {action}
        </div>
    );
}
