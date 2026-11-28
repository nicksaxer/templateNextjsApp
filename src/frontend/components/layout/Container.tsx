import type { ComponentPropsWithoutRef } from 'react';
import cx from '@frontend/utils/classNames';
import styles from './Container.module.css';

export default function Container({children, className, ...props}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div {...props} className={cx(styles.container, className)}>
            {children}
        </div>
    );
}
