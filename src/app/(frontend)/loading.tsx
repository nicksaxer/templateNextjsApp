import Container from '@frontend/components/layout/Container';
import LoadingIndicator from '@frontend/components/ui/elements/LoadingIndicator';

export default function Loading() {
    return (
        <Container>
            <LoadingIndicator label="Loading…" />
        </Container>
    );
}
