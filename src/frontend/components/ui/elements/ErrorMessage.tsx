import type { ComponentPropsWithoutRef } from 'react';
import cx from '@frontend/utils/classNames';
import styles from './ErrorMessage.module.css';

export default function ErrorMessage({children, className, ...props}: ComponentPropsWithoutRef<'p'>) {
    if (!children) {return null;}
    return (
        <p {...props} role="alert" className={cx(styles.error, className)}>
            <span>{children}</span>
        </p>
    );
}
