import type { RenderedMail } from '@backend/types';
import styles from './MailPreview.module.css';

export default function MailPreview({mail}: {mail: RenderedMail}) {
    return (
        <div>
            <p>{mail.subject}</p>
            <iframe title={`Email preview: ${mail.subject}`} srcDoc={mail.html} sandbox="" className={styles.mailFrame} />
        </div>
    );
}
