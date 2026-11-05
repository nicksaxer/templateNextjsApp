import type { ComponentPropsWithoutRef } from 'react';
import styles from './Container.module.css';

export default function Container({children, className = '', ...props}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div {...props} className={`${styles.container} ${className}`}>
            {children}
        </div>
    );
}
