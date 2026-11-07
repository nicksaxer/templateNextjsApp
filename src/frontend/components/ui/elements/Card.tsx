import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Card.module.css';

export default function Card({
    title,
    description,
    action,
    children,
    className = '',
    ...props
}: Omit<ComponentPropsWithoutRef<'section'>, 'title'> & {title?: string; description?: string; action?: ReactNode}) {
    return (
        <section {...props} className={`${styles.card} ${className}`}>
            {(title || action) && (
                <div className={styles.cardHeader}>
                    <div>
                        {title && <h3>{title}</h3>}
                        {description && <p>{description}</p>}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}
