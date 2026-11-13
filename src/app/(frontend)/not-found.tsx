import Container from '@frontend/components/layout/Container';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import NavigationLink from '@frontend/components/ui/elements/NavigationLink';

export default function NotFound() {
    return (
        <Container>
            <EmptyState title="Page not found" icon="signpost-split" action={<NavigationLink href="/" showPending>Back to component library</NavigationLink>}>
                This page does not exist.
            </EmptyState>
        </Container>
    );
}
