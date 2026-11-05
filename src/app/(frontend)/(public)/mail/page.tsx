import type { Metadata } from 'next';
import { getShowcase } from '@backend/queries/example';
import Container from '@frontend/components/layout/Container';
import MailGallery from '@frontend/components/modules/Mail/MailGallery';
import styles from '@frontend/components/modules/Showcase/Showcase.module.css';

export const metadata: Metadata = {title: 'The little details'};

export default async function MailPage() {
    const {mails} = await getShowcase();
    return (
        <Container>
            <div className={styles.sectionHeading}>
                <div>
                    <span className={styles.eyebrow}>THE LITTLE DETAILS</span>
                    <h1>A note worth opening.</h1>
                    <p>A warm hello. A thoughtful follow-up. The small things make a difference.</p>
                </div>
            </div>
            <MailGallery mails={mails} />
        </Container>
    );
}
