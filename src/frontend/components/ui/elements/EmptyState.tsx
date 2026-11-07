import type { ReactNode } from 'react';
import Icon from './Icon';
import styles from './EmptyState.module.css';

export default function EmptyState({title, children, action, icon = 'inbox'}: {title: string; children?: ReactNode; action?: ReactNode; icon?: string}) {
    return (
        <div className={styles.empty}>
            <Icon name={icon} />
            <h3>{title}</h3>
            <p>{children}</p>
            {action}
        </div>
    );
}
