import type {ComponentPropsWithoutRef} from 'react';
import type {Tone} from './Alert';
import styles from './Feedback.module.css';

export default function Badge({tone = 'info', className = '', children, ...props}: ComponentPropsWithoutRef<'span'> & {tone?: Tone}) {
    return (
        <span {...props} className={`${styles.badge} ${className}`} data-tone={tone}>
            {children}
        </span>
    );
}
