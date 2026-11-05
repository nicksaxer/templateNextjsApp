import type {Metadata} from 'next';
import { getShowcase } from '@backend/queries/example';
import Container from '@frontend/components/layout/Container';
import ProjectForm from '@frontend/components/modules/Project/ProjectForm';
import styles from '@frontend/components/modules/Showcase/Showcase.module.css';

export const metadata: Metadata = {title: 'A new project'};

export default async function ProjectPage() {
    const {plans} = await getShowcase();
    return (
        <Container>
            <div className={styles.sectionHeading}>
                <div>
                    <span className={styles.eyebrow}>LET’S MAKE SOMETHING</span>
                    <h1>A small idea. A good beginning.</h1>
                    <p>Pick a name, bring your people, and see your next project take shape.</p>
                </div>
            </div>
            <ProjectForm plans={plans} />
        </Container>
    );
}
