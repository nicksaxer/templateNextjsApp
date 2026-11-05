import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LoadingIndicator.module.css';

export default function LoadingIndicator({label = 'Loading…', delay = true, compact = false}: {label?: string; delay?: boolean; compact?: boolean}) {
    return (
        <div className={`${styles.loading} ${compact ? styles.compact : ''}`} data-delayed={delay} role="status">
            <FontAwesomeIcon icon={faCircleNotch} className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
        </div>
    );
}
