'use client';

import { type ComponentPropsWithoutRef, useId } from 'react';
import ErrorMessage from '../elements/ErrorMessage';
import { describedBy, type FieldProps } from './Field';
import styles from './TextArea.module.css';

export default function TextArea({label, hint, error, id, className = '', ...props}: ComponentPropsWithoutRef<'textarea'> & FieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <div>
            <div className={`${styles.wrapper} ${className}`} data-invalid={!!error}>
                <label className={styles.label} htmlFor={inputId}>{label}</label>
                <textarea rows={3} {...props} id={inputId} className={styles.input} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(inputId, hint, error, props['aria-describedby'])} />
            </div>
            {hint && <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>}
            <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>
        </div>
    );
}
