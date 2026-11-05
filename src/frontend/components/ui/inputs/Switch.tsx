'use client';

import type {ComponentPropsWithoutRef} from 'react';
import styles from './Inputs.module.css';

interface SwitchProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange'> {
    label: string;
    onChange?: (checked: boolean) => void;
}

export default function Switch({label, onChange, className = '', ...props}: SwitchProps) {
    return (
        <label className={`${styles.switch} ${className}`}>
            <input {...props} type="checkbox" role="switch" onChange={event => onChange?.(event.target.checked)} />
            <span className={styles.track} aria-hidden="true" />
            <span>{label}</span>
        </label>
    );
}
