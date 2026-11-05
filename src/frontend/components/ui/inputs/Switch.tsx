'use client';

import type { ComponentPropsWithoutRef } from 'react';
import styles from './Switch.module.css';

interface SwitchProps extends Omit<ComponentPropsWithoutRef<"label">, 'onChange'> {
    label: string;
    name?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

export default function Switch({ label, name, checked, disabled = false, onChange, className, ...props }: SwitchProps) {
    return (
        <label {...props} className={`${styles.switch} ${className || ''}`}>
            <input name={name} type="checkbox" role="switch" aria-label={label} checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
            <span className={styles.track} aria-hidden="true"></span>
        </label>
    );
}
