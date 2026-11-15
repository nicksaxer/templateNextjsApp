import styles from './Skeleton.module.css';

export default function Skeleton({lines = 3, className}: {lines?: number; className?: string}) {
    return (
        <div className={`${styles.skeleton}${className ? ` ${className}` : ''}`} aria-hidden="true">
            {Array.from({length: lines}, (_, index) => (
                <span key={index} />
            ))}
        </div>
    );
}
