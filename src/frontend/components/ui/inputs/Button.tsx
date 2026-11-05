import type { ComponentPropsWithoutRef } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Button.module.css';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    bsicon?: string;
    icon?: IconDefinition;
    filled?: boolean;
    pending?: boolean;
    simple?: boolean;
    iconOnly?: boolean;
    danger?: boolean;
}

export default function Button({bsicon, icon, filled, simple, iconOnly, danger, children, className = '', type = 'button', pending, disabled, ...props}: ButtonProps) {
    return (
        <button {...props} type={type} disabled={disabled || pending} aria-busy={pending || undefined} className={`${styles.button} ${filled ? styles.filled : ''} ${simple ? styles.buttonSimple : ''} ${iconOnly ? styles.iconOnly : ''} ${danger ? styles.danger : ''} ${className}`}>
            {pending ? <i className={`bi bi-arrow-repeat ${styles.pending}`} aria-hidden="true" /> : icon ? <FontAwesomeIcon icon={icon} className={styles.icon} aria-hidden="true" /> : bsicon && <i className={`bi ${bsicon} ${styles.icon}`} aria-hidden="true" />}
            {iconOnly ? children : <span>{children}</span>}
        </button>
    );
}
