'use client';

import { type ComponentPropsWithoutRef, type ReactNode, type Ref, useId, useState } from 'react';
import ErrorMessage from '../elements/ErrorMessage';
import { describedBy } from './Field';
import styles from './TextInput.module.css';

export interface TextInputProps extends ComponentPropsWithoutRef<'input'> {
    label: string;
    inline?: boolean;
    error?: string;
    hint?: string;
    inputRef?: Ref<HTMLInputElement>;
    endAdornment?: ReactNode;
}

export default function TextInput({label, type = 'text', id, className, disabled, inline = false, inputRef, endAdornment, error, hint, ...props}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <>
            <div data-invalid={!!error} className={`${styles.wrapper} ${inline ? styles.inline : ''} ${className || ''}`}>
                <label htmlFor={inputId} className={inline ? styles.inlineLabel : styles.label}>{label}</label>
                <input {...props} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(inputId, hint, error, props['aria-describedby'])} ref={inputRef} id={inputId} type={type === 'password' && showPassword ? 'text' : type} disabled={disabled} className={`${inline ? styles.inlineInput : styles.input} ${type === 'password' ? styles.labelPassword : ''} ${endAdornment ? styles.hasAdornment : ''}`} />
                {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
                {type === 'password' && (
                    <button type="button" className={styles.viewPasswordWrapper} disabled={disabled} onClick={() => setShowPassword(visible => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls={inputId}>
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                    </button>
                )}
            </div>
            {hint && <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>}
            <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>
        </>
    );
}
