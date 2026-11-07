import { cookies } from 'next/headers';
import { getShowcase } from '@backend/queries/example';
import { getTheme } from '@frontend/utils/prefs';
import Container from '@frontend/components/layout/Container';
import InputsShowcase from '@frontend/components/modules/Showcase/InputsShowcase';
import FeedbackShowcase from '@frontend/components/modules/Showcase/FeedbackShowcase';
import MotionShowcase from '@frontend/components/modules/Showcase/MotionShowcase';
import AppearanceExamples from '@frontend/components/modules/Showcase/AppearanceExamples';
import ProjectForm from '@frontend/components/modules/Showcase/ProjectForm';
import MailGallery from '@frontend/components/modules/Showcase/MailGallery';
import styles from '@frontend/components/modules/Showcase/Showcase.module.css';

export default async function HomePage() {
    const [{plans, mails}, cookieStore] = await Promise.all([getShowcase(), cookies()]);
    return (
        <Container>
            <h1 className={styles.title}>Component library</h1>
            <AppearanceExamples initialTheme={getTheme(cookieStore.get('theme')?.value)} />
            <InputsShowcase />
            <FeedbackShowcase />
            <MotionShowcase />
            <section id="server-example" className={styles.section}>
                <h2>Form validation</h2>
                <ProjectForm plans={plans} />
            </section>
            <section id="mail" className={styles.section}>
                <h2>Mail templates</h2>
                <MailGallery mails={mails} />
            </section>
        </Container>
    );
}
