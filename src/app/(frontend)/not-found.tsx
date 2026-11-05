import Link from 'next/link';
import Container from '@frontend/components/layout/Container';
import EmptyState from '@frontend/components/ui/elements/EmptyState';

export default function NotFound() {
    return (
        <Container>
            <EmptyState title="Page not found" icon="signpost-split" action={<Link href="/">Back to component library</Link>}>
                This page does not exist.
            </EmptyState>
        </Container>
    );
}
