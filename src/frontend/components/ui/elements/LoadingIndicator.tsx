import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LoadingIndicator.module.css';

export default function LoadingIndicator({label = 'Loading…', delay = true, compact = false, className}: {label?: string; delay?: boolean; compact?: boolean; className?: string}) {
    return (
        <div className={`${styles.loading}${compact ? ` ${styles.compact}` : ''}${className ? ` ${className}` : ''}`} data-delayed={delay} role="status">
            <FontAwesomeIcon icon={faCircleNotch} className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
        </div>
    );
}
