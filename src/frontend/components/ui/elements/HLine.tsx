import type { ComponentPropsWithoutRef } from 'react';
import styles from './HLine.module.css';

export default function HLine({children, className = '', ...props}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div {...props} className={`${styles.Line} ${className || ''}`}>
            <span>{children}</span>
        </div>
    );
}
