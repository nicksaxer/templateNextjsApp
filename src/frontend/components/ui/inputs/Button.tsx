import type { ComponentPropsWithoutRef } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import styles from './Button.module.css';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    bsicon?: string;
    icon?: IconDefinition;
    filled?: boolean;
    wide?: boolean;
    pending?: boolean;
    simple?: boolean;
    iconOnly?: boolean;
    danger?: boolean;
}

export default function Button({bsicon, icon, filled, wide, simple, iconOnly, danger, children, className = '', type = 'button', pending, disabled, ...props}: ButtonProps) {
    return (
        <button {...props} type={type} disabled={disabled || pending} aria-busy={pending || undefined} className={`${styles.button} ${filled ? styles.filled : ''} ${wide ? styles.wide : ''} ${simple ? styles.buttonSimple : ''} ${iconOnly ? styles.iconOnly : ''} ${danger ? styles.danger : ''} ${className}`}>
            {pending ? <FontAwesomeIcon icon={faCircleNotch} className={styles.pending} aria-hidden="true" /> : icon ? <FontAwesomeIcon icon={icon} className={styles.icon} aria-hidden="true" /> : bsicon && <i className={`bi ${bsicon} ${styles.icon}`} aria-hidden="true" />}
            {iconOnly ? children : <span>{children}</span>}
        </button>
    );
}
