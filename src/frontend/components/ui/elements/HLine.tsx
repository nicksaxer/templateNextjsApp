import type { ComponentPropsWithoutRef } from 'react';
import cx from '@frontend/utils/classNames';
import styles from './HLine.module.css';

export default function HLine({children, className, ...props}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div {...props} className={cx(styles.Line, className)}>
            <span>{children}</span>
        </div>
    );
}
