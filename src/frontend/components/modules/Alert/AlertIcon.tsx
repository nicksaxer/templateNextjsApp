import type { AlertType } from './Alert';
import styles from './AlertIcon.module.css';

export default function AlertIcon({type}: {type: AlertType}) {
    return (
        <svg className={styles.icon} data-type={type} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle className={styles.track} cx="50" cy="50" r="42" />
            <circle className={styles.ring} cx="50" cy="50" r="42" pathLength="1" />
            <g className={styles.symbol}>
                {type === 'success' && <path className={styles.stroke} d="M29 51 L43 65 L72 35" pathLength="1" />}
                {type === 'error' && <>
                    <path className={styles.stroke} d="M35 35 L65 65" pathLength="1" />
                    <path className={`${styles.stroke} ${styles.secondStroke}`} d="M65 35 L35 65" pathLength="1" />
                </>}
                {type === 'warning' && <>
                    <path className={styles.stroke} d="M50 29 V55" pathLength="1" />
                    <circle className={styles.dot} cx="50" cy="68" r="3" fill="currentColor" stroke="none" />
                </>}
                {type === 'info' && <>
                    <circle className={styles.dot} cx="50" cy="31" r="3" fill="currentColor" stroke="none" />
                    <path className={styles.stroke} d="M50 44 V70" pathLength="1" />
                </>}
            </g>
        </svg>
    );
}
