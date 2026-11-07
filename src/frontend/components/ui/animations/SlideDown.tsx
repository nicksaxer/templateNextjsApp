import type { ComponentPropsWithoutRef } from 'react';
import styles from './SlideDown.module.css';

export default function SlideDown({open, children, className = '', ...props}: ComponentPropsWithoutRef<'div'> & {open: boolean}) {
    return (
        <div {...props} className={`${styles.slideDown} ${className}`} data-open={open} inert={!open} aria-hidden={!open}>
            <div className={styles.clip}>
                <div>{children}</div>
            </div>
        </div>
    );
}
