import type { ReactNode } from 'react';
import ErrorMessage from '../elements/ErrorMessage';
import styles from './Field.module.css';

export interface FieldProps {
    label: string;
    error?: string;
    hint?: string;
    className?: string;
}

export function describedBy(id: string, hint?: string, error?: string, existing?: string): string | undefined {
    return [existing, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
}

export default function Field({label, error, hint, className = '', id, children}: FieldProps & {id: string; children: ReactNode}) {
    return (
        <div className={`${styles.field} ${className}`}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            {children}
            {hint && (
                <p className={styles.hint} id={`${id}-hint`}>
                    {hint}
                </p>
            )}
            <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>
        </div>
    );
}
