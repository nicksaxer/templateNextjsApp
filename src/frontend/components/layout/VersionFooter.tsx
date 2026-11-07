import { appConfig } from '@backend/config/app.config';
import styles from './VersionFooter.module.css';

export default function VersionFooter() {
    return <footer className={styles.footer}>{`v${appConfig.version}`}</footer>;
}
