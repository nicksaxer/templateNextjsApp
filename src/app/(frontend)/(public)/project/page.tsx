import Link from 'next/link';
import { getShowcase } from '@backend/queries/example';
import Container from '@frontend/components/layout/Container';
import ProjectForm from '@frontend/components/modules/Project/ProjectForm';
import styles from '@frontend/components/modules/Showcase/Showcase.module.css';

export default async function Page() {
    const {plans} = await getShowcase();
    return <Container><Link href="/">← Component library</Link><section className={styles.section}><h2>Form validation</h2><ProjectForm plans={plans} /></section></Container>;
}
