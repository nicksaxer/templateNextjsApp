'use client';

import type { RenderedMail } from '@backend/types';
import Tabs from '@frontend/components/ui/elements/Tabs';
import MailPreview from './MailPreview';
import styles from './Mail.module.css';

export default function MailGallery({mails}: {mails: RenderedMail[]}) {
    return (
        <div className={styles.gallery}>
            <Tabs label="Choose an email" tabs={mails.map((mail, index) => ({label: index === 0 ? 'A warm welcome' : 'A new beginning', content: <MailPreview mail={mail} />}))} />
        </div>
    );
}
