import type { ComponentPropsWithoutRef } from 'react';
import cx from '@frontend/utils/classNames';
import styles from './FadeIn.module.css';

export default function FadeIn({children, className, ...props}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div {...props} className={cx(styles.fadeIn, className)}>
            {children}
        </div>
    );
}
