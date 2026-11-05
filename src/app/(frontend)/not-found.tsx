import Link from 'next/link';
import Container from '@frontend/components/layout/Container';
import EmptyState from '@frontend/components/ui/elements/EmptyState';

export default function NotFound() {
    return (
        <Container>
            <EmptyState title="A little off the beaten path" icon="signpost-split" action={<Link href="/">Back to familiar ground →</Link>}>
                There’s nothing here just yet. Let’s head home.
            </EmptyState>
        </Container>
    );
}
