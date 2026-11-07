import type { RenderedMail } from '@backend/types';
import Tabs, { Tab } from '@frontend/components/ui/elements/Tabs';
import MailPreview from './MailPreview';
import styles from './MailGallery.module.css';

export default function MailGallery({mails}: {mails: RenderedMail[]}) {
    return (
        <div className={styles.gallery}>
            <Tabs label="Choose an email">
                {mails.map((mail, index) => (
                    <Tab key={mail.subject} label={index === 0 ? 'Welcome email' : 'Project email'}>
                        <MailPreview mail={mail} />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
