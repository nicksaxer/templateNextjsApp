import { useId } from 'react';
import styles from './Progress.module.css';

export default function Progress({value, label, max = 100, className}: {value: number; label: string; max?: number; className?: string}) {
    const id = useId();
    return (
        <div className={`${styles.progress}${className ? ` ${className}` : ''}`}>
            <div>
                <label htmlFor={id}>{label}</label>
                <span>{Math.round((value / max) * 100)}%</span>
            </div>
            <progress id={id} value={value} max={max} />
        </div>
    );
}
