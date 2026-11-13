import type { ComponentPropsWithoutRef } from 'react';
import styles from './SlideDown.module.css';

export default function SlideDown({open, children, className = '', ...props}: ComponentPropsWithoutRef<'div'> & {open?: boolean}) {
    return (
        <div {...props} className={`${styles.slideDown} ${className}`} data-open={open} inert={open === false || props.inert} aria-hidden={open === false ? true : props['aria-hidden']}>
            <div className={styles.clip}>{children}</div>
        </div>
    );
}
