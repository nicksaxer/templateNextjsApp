import cx from '@frontend/utils/classNames';
import styles from './Skeleton.module.css';

export default function Skeleton({lines = 3, className}: {lines?: number; className?: string}) {
    return (
        <div className={cx(styles.skeleton, className)} aria-hidden="true">
            {Array.from({length: lines}, (_, index) => (
                <span key={index} />
            ))}
        </div>
    );
}
