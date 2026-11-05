'use client';

import { type ComponentPropsWithoutRef, useId } from 'react';
import type { SelectOption } from '@backend/types';
import Field, { describedBy, type FieldProps } from './Field';
import styles from './Inputs.module.css';

export interface SelectInputProps extends ComponentPropsWithoutRef<'select'>, FieldProps {
    options: readonly SelectOption[];
}

export default function SelectInput({label, hint, error, options, id, className, ...props}: SelectInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <Field id={inputId} label={label} hint={hint} error={error} className={className}>
            <select {...props} id={inputId} className={styles.input} aria-invalid={error ? true : props['aria-invalid']}
                aria-describedby={describedBy(inputId, hint, error, props['aria-describedby'])}>
                {options.map(option => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}
