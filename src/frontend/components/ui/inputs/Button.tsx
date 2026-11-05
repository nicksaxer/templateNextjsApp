import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from '@frontend/utils/classnames';
import styles from './Button.module.css';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    bsicon?: string;
    icon?: ReactNode;
    filled?: boolean;
    simple?: boolean;
    iconOnly?: boolean;
    danger?: boolean;
    pending?: boolean;
}

export default function Button({bsicon, icon, filled, simple, iconOnly, danger, pending, children, className, type = 'button', disabled, ...props}: ButtonProps) {
    return (
        <button {...props} type={type} disabled={disabled || pending} aria-busy={pending || undefined}
            className={classNames(styles.button, filled && styles.filled, simple && styles.simple, iconOnly && styles.iconOnly, danger && styles.danger, className)}>
            {pending ? <span className={styles.spinner} aria-hidden="true" /> : (icon ?? (bsicon && <i className={`bi ${bsicon}`} aria-hidden="true" />))}
            {children}
        </button>
    );
}
