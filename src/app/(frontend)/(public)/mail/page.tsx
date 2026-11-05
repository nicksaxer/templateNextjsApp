import Link from 'next/link';
import { getShowcase } from '@backend/queries/example';
import Container from '@frontend/components/layout/Container';
import MailGallery from '@frontend/components/modules/Mail/MailGallery';
import styles from '@frontend/components/modules/Showcase/Showcase.module.css';

export default async function Page() {
    const {mails} = await getShowcase();
    return <Container><Link href="/">← Component library</Link><section className={styles.section}><h2>Mail templates</h2><MailGallery mails={mails} /></section></Container>;
}
