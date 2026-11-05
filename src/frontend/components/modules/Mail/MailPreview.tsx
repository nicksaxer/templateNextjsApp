import type {RenderedMail} from '@backend/types';
import Card from '@frontend/components/ui/elements/Card';
import Badge from '@frontend/components/ui/elements/Badge';
import styles from './Mail.module.css';

export default function MailPreview({mail}: {mail: RenderedMail}) {
    return (
        <Card title="A note in your inbox" action={<Badge>Preview only</Badge>}>
            <div className={styles.mailHeader}>
                <span>FROM</span>
                <strong>Foundation</strong>
                <span>SUBJECT</span>
                <strong>{mail.subject}</strong>
            </div>
            <iframe title={`Email preview: ${mail.subject}`} srcDoc={mail.html} sandbox="" className={styles.mailFrame} />
            <p className={styles.caption}>A small detail that makes the whole thing feel complete. No email has been sent.</p>
        </Card>
    );
}
