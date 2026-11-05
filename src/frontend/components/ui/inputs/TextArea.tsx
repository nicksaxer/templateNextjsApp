'use client';

import { type ComponentPropsWithoutRef, useId } from 'react';
import Field, {describedBy, type FieldProps} from './Field';
import styles from './Inputs.module.css';

export default function TextArea({label, hint, error, id, className, ...props}: ComponentPropsWithoutRef<'textarea'> & FieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <Field id={inputId} label={label} hint={hint} error={error} className={className}>
            <textarea rows={3} {...props} id={inputId} className={styles.input} aria-invalid={error ? true : props['aria-invalid']}
                aria-describedby={describedBy(inputId, hint, error, props['aria-describedby'])} />
        </Field>
    );
}
