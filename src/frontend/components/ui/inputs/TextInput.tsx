'use client';

import { type ComponentPropsWithoutRef, type ReactNode, type Ref, useId, useState } from 'react';
import Field, {describedBy, type FieldProps} from './Field';
import styles from './Inputs.module.css';

export interface TextInputProps extends ComponentPropsWithoutRef<'input'>, FieldProps {
    inputRef?: Ref<HTMLInputElement>;
    endAdornment?: ReactNode;
}

export default function TextInput({label, error, hint, type = 'text', id, className, disabled, inputRef, endAdornment, ...props}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <Field id={inputId} label={label} hint={hint} error={error} className={className}>
            <div className={styles.control}>
                <input {...props} ref={inputRef} id={inputId} type={type === 'password' && showPassword ? 'text' : type} disabled={disabled}
                    aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(inputId, hint, error, props['aria-describedby'])} className={styles.input}
                    data-adornment={Boolean(endAdornment) || type === 'password'} />
                {endAdornment && <span className={styles.adornment}>{endAdornment}</span>}
                {type === 'password' && (
                    <button type="button" className={styles.password} disabled={disabled} onClick={() => setShowPassword(value => !value)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls={inputId}>
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`} aria-hidden="true" />
                    </button>
                )}
            </div>
        </Field>
    );
}
