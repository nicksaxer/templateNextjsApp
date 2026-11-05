import type {ComponentPropsWithoutRef} from 'react';
import styles from './Motion.module.css';

export default function FadeIn({children, className = '', ...props}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div {...props} className={`${styles.fadeIn} ${className}`}>
            {children}
        </div>
    );
}
