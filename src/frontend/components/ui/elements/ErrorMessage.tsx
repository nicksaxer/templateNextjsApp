import type { ComponentPropsWithoutRef } from 'react';
import styles from './Feedback.module.css';

export default function ErrorMessage({children, className = '', ...props}: ComponentPropsWithoutRef<'p'>) {
    if (!children) {return null;}
    return (
        <p {...props} role="alert" className={`${styles.error} ${className}`}>
            <span>{children}</span>
        </p>
    );
}
