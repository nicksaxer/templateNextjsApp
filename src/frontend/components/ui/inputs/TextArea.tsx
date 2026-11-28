'use client';

import { type ComponentPropsWithoutRef, useId } from 'react';
import ErrorMessage from '../elements/ErrorMessage';
import describedBy from '@frontend/utils/ariaDescribedBy';
import cx from '@frontend/utils/classNames';
import styles from './TextArea.module.css';

interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
    label: string;
    grey?: boolean;
    error?: string;
    hint?: string;
}

export default function TextArea({label, grey, hint, error, id, className, ...props}: TextAreaProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <div>
            <div className={cx(styles.wrapper, grey && styles.grey, className)} data-invalid={!!error}>
                <label className={styles.label} htmlFor={inputId}>{label}</label>
                <textarea rows={3} {...props} id={inputId} className={styles.input} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(inputId, hint, error, props['aria-describedby'])} />
            </div>
            {hint && <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>}
            <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>
        </div>
    );
}
