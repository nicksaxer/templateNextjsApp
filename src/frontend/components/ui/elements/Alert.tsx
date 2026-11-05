import type {ComponentPropsWithoutRef} from 'react';
import Icon from './Icon';
import styles from './Feedback.module.css';

export type Tone = 'info' | 'success' | 'warning' | 'danger';

export default function Alert({tone = 'info', title, children, className = '', ...props}: ComponentPropsWithoutRef<'div'> & {tone?: Tone; title?: string}) {
    const icon = {info: 'info-circle', success: 'check-circle', warning: 'exclamation-triangle', danger: 'exclamation-circle'}[tone];
    return (
        <div role={tone === 'danger' ? 'alert' : 'status'} {...props} className={`${styles.alert} ${className}`} data-tone={tone}>
            <Icon name={icon} />
            <div>
                {title && <strong>{title}</strong>}
                {children && <div>{children}</div>}
            </div>
        </div>
    );
}
