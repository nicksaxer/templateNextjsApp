import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cx from '@frontend/utils/classNames';
import styles from './Checkbox.module.css';

// `label` may hold rich content so a whole row can be the tap target.
export default function Checkbox({label, className, ...props}: Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {label: ReactNode}) {
    return (
        <label className={cx(styles.checkbox, className)}>
            <input {...props} type="checkbox" />
            <span>{label}</span>
        </label>
    );
}
