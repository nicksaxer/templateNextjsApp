import type {ComponentPropsWithoutRef} from 'react';
import styles from './Inputs.module.css';

export default function Checkbox({label, className = '', ...props}: Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {label: string}) {
    return (
        <label className={`${styles.checkbox} ${className}`}>
            <input {...props} type="checkbox" />
            <span>{label}</span>
        </label>
    );
}
