import type { ComponentPropsWithoutRef } from 'react';
import styles from './Feedback.module.css';

export default function HLine({className = '', ...props}: ComponentPropsWithoutRef<'hr'>) {
    return <hr {...props} className={`${styles.line} ${className}`} />;
}
