import styles from './Feedback.module.css';

export default function LoadingIndicator({label = 'Loading…', delay = true}: {label?: string; delay?: boolean}) {
    return (
        <div role="status" className={styles.loading} data-delayed={delay}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>{label}</span>
        </div>
    );
}
