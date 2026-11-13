'use client';

import { type ComponentPropsWithoutRef, useId, useLayoutEffect, useRef } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import inputStyles from './TextInput.module.css';
import styles from './SelectInput.module.css';

interface SelectInputProps extends Omit<ComponentPropsWithoutRef<'select'>, 'multiple' | 'size' | 'value' | 'defaultValue'> {
    label: string;
    value?: string | number;
    defaultValue?: string | number;
}

export default function SelectInput({label, id, className = '', children, value, defaultValue, ...props}: SelectInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const ref = useRef<HTMLSelectElement>(null);

    useLayoutEffect(() => {
        if (value === undefined || !ref.current) {return;}
        // Keep native form resets in sync with the current controlled value.
        for (const option of ref.current.options) {
            if (option.defaultSelected !== option.selected) {option.defaultSelected = option.selected;}
        }
    }, [children, value]);

    return (
        <div className={`${inputStyles.wrapper} ${styles.wrapper} ${className}`} data-invalid={props['aria-invalid'] === true || props['aria-invalid'] === 'true'}>
            <label htmlFor={inputId} className={inputStyles.label}>{label}</label>
            <select {...props} ref={ref} id={inputId} className={styles.input} value={value} defaultValue={value === undefined ? defaultValue : undefined}>{children}</select>
            <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} aria-hidden="true" />
        </div>
    );
}
